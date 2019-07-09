<template>
  <b-row>
    <b-col>
      <b-navbar
        toggleable="lg"
        type="dark"
        variant="primary"
        class="rounded my-3"
      >
        <b-navbar-brand :to="{ name: 'home' }">
          <font-awesome-icon icon="heart" fixed-width />
          EOS Web Boilerplate
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item :to="{ name: 'home' }" exact>Home</b-nav-item>
            <b-nav-item :to="{ name: 'about' }" exact>About</b-nav-item>
            <b-nav-item-dropdown :text="language.toUpperCase()" right>
              <b-dropdown-item
                @click="language = 'en'"
                :active="language === 'en'"
                >English</b-dropdown-item
              >
              <b-dropdown-item
                @click="language = 'de'"
                :active="language === 'de'"
                >Deutsch</b-dropdown-item
              >
            </b-nav-item-dropdown>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item @click="loginAction()">
              <eos-transit />
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { vxm } from '@/store/'
import EosTransit from '@/components/authentication/EosTransit.vue'

@Component({
  components: {
    EosTransit
  }
})
export default class Navigation extends Vue {
  // computed
  get language() {
    return vxm.core.language
  }

  set language(lang: string) {
    vxm.core.setLanguage(lang)
  }

  get loginStatus() {
    return vxm.eosTransit.loginStatus
  }

  // methods
  async loginAction() {
    if (this.loginStatus[0] === 'Login')
      vxm.eosTransit.initLogin(vxm.eosTransit.walletProviders[0])
    else if (
      this.loginStatus[0] !== 'Authenticating' &&
      this.loginStatus[0] !== 'Connecting' &&
      this.loginStatus[0] !== 'Fetching'
    ) {
      vxm.eosTransit.logout()
    }
  }
}
</script>

<style scoped></style>
