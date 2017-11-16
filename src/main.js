import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import api from './api'
import transform from './transform'
import createPersistedState from 'vuex-persistedstate'

require('bulma.css')

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
    showSettings: false,
    data: [],
  },
  mutations: {
    setShowSettings (state) {
      state.showSettings = true
    },
    setCredentials (state, { accessKeyId, secretAccessKey, region }) {
      state.accessKeyId = accessKeyId
      state.secretAccessKey = secretAccessKey
      state.region = region
      state.showSettings = false
    },
    setData (state, data) {
      Vue.set(state, 'data', data)
    },
  },
  actions: {
    setShowSettings ({ commit }) {
      commit('setShowSettings')
    },
    setCredentials ({ commit, dispatch }, credentials) {
      commit('setCredentials', credentials)
      dispatch('getData')
    },
    getData ({ commit, state, getters, dispatch }) {
      if (getters.allCredentialsSet) {
        api.getData(getters.credentials)
          .then((data) => {
            return transform(data)
          })
          // .then((data) => console.log(JSON.stringify(data,null,2)))
          .then((data) => {
            commit('setData', data)
          })
          .catch((error) => {
            console.error(error)
            // TODO Show error
            // dispatch('error', error)
          })
      } else {
        // TODO Show error
        // dispatch('error', 'Missing credentials')
      }
    },
  },
  getters: {
    credentials ({ accessKeyId, secretAccessKey, region }) {
      return {
        accessKeyId,
        secretAccessKey,
        region,
      }
    },
    allCredentialsSet (state) {
      return !!(state.accessKeyId && state.secretAccessKey && state.region && !state.showSettings)
    },
  },
  plugins: [
    createPersistedState({
      paths: [
        'accessKeyId',
        'secretAccessKey',
        'region',
      ]
    })
  ],
})

new Vue({
  el: '#app',
  render: h => h(App),
  store,
})
