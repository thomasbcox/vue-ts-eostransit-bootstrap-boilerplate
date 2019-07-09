<template>
  <div v-if="true">
    {{ loginStatus[0] }}
    <font-awesome-icon
      :icon="loginStatus[1]"
      :pulse="loginStatus[2]"
      fixed-width
    />
  </div>
  <div v-else class="text-center">
    <h1
      v-for="provider in walletProviders"
      :key="provider.id"
      class="mt-3"
      @click="initLogin(provider)"
    >
      {{ loginStatus }}
    </h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { vxm } from '@/store/'
import { WalletProvider } from 'eos-transit'

@Component
export default class EosTransit extends Vue {
  // computed
  get walletProviders() {
    return vxm.eosTransit.walletProviders
  }

  get selectedProvider() {
    return vxm.eosTransit.selectedProvider
  }

  get loginStatus() {
    return vxm.eosTransit.loginStatus
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
