<template>
  <div id="app">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="container">
        <div class="navbar-brand">
          <div class="navbar-item">
            Security Groups Edge Bundling
          </div>
          <div class="navbar-item">
            <div class="button is-small" @click="showSettings">
              Settings
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div class="container">
      <visualisation></visualisation>
    </div>
    <settings v-if="settingsAreVisible"></settings>
  </div>
</template>

<script>
import Settings from './components/Settings.vue'
import Visualisation from './components/Visualisation.vue'

export default {
  name: 'app',
  components: {
    Settings,
    Visualisation,
  },
  data () {
    return {}
  },
  methods: {
    showSettings () {
      this.$store.dispatch('setShowSettings')
    }
  },
  computed: {
    settingsAreVisible () {
      return !this.$store.getters.allCredentialsSet
    },
  }
}
</script>

<style>
</style>
