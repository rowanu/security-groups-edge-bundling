<template>
  <div id="settings">
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Settings</p>
        </header>
        <section class="modal-card-body">
            <div class="field">
              <label class="label">Access Key Id</label>
              <div class="control">
                <input v-model="accessKeyId" class="input" type="text" placeholder="accessKeyId">
              </div>
            </div>
            <div class="field">
              <label class="label">Secret Acces Key</label>
              <div class="control">
                <input v-model="secretAccessKey" class="input" type="password" placeholder="secretAccessKey">
              </div>
            </div>
            <div class="field">
              <label class="label">Region</label>
              <div class="control">
                <input v-model="region" class="input" type="text" placeholder="region">
              </div>
            </div>
          <div class="field">
          <p>
          Settings are saved using your browser's
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/window/localStorage">local
            storage</a>, not remotely.
          </p>
          <p>
          You can review <a
             href="https://github.com/rowanu/security-groups-edge-bundling">the
             source code on GitHub</a>.
          </p>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary" @click="onSubmit">Save changes</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'settings',
  data () {
    return {
      accessKeyId: '',
      secretAccessKey: '',
      region: '',
    }
  },
  methods: {
    onSubmit () {
      const credentials = {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
        region: this.region,
      }
      this.$store.dispatch('setCredentials', credentials)
    },
  },
  created () {
    this.accessKeyId = this.$store.state.accessKeyId
    this.secretAccessKey = this.$store.state.secretAccessKey
    this.region = this.$store.state.region
  },
  computed: {
  },
}
</script>

<style>
</style>
