<template>
  <div>
    <b-jumbotron
      header="Bootstrap Vue"
      lead="Bootstrap 4 Components for Vue.js 2"
    >
      <p>For more information visit website</p>
      <b-button variant="primary" href="#">More Info</b-button>
    </b-jumbotron>
    <span>Auth: {{ isAuthenticated }}</span> <span @click="logout()">Logout</span>
    <pre v-if="wallet">{{ wallet.auth }}</pre>
    <HelloWorld :msg="$t('welcome')" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { vxm } from '@/store'
import HelloWorld from '@/components/HelloWorld.vue'
import EosTransit from '@/components/authentication/EosTransit.vue' // @ is an alias to /src

@Component({
  components: {
    HelloWorld,
    EosTransit
  }
})
export default class Home extends Vue {
  get wallet() {
    return vxm.eosTransit.wallet
  }

  get isAuthenticated() {
    if (vxm.eosTransit.walletState)
      return vxm.eosTransit.walletState.authenticated
    else return false
  }

  logout() {
    vxm.eosTransit.logout()
  }
}
</script>
