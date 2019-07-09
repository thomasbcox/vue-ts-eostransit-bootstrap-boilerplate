import {
  VuexModule,
  mutation,
  action,
  getter,
  Module
} from 'vuex-class-component'
import {
  initAccessContext,
  WalletProvider,
  Wallet,
  WalletState
} from 'eos-transit'
import scatter from 'eos-transit-scatter-provider'

@Module({ namespacedPath: 'eosTransit/' })
export class EosTransitModule extends VuexModule {
  // We need to initialize the so called "access context" first,
  // passing it our dapp name, network configuration and
  // providers we want to make available to the dapp.
  // The context is responsible for initializing wallet connectoins
  // and tracking state of connected wallets.

  // We're using our own test network as an example here.
  @getter accessContext = initAccessContext({
    appName: 'MyEOS Web DAPP',
    network: {
      host: 'nodes.get-scatter.com',
      port: 443,
      protocol: 'https',
      chainId:
        'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
    },
    walletProviders: [scatter()]
  })

  // We're all set now and can get the list of available wallet providers
  // (we only have Scatter provider configured, so there will be only one):
  @getter walletProviders = this.accessContext.getWalletProviders()
  /* [{
   *   id: 'scatter',
   *   meta: {
   *    name: 'Scatter Desktop',
   *    shortName: 'Scatter',
   *    description: 'Scatter Desktop application that keeps your private keys secure'
   *   },
   *   signatureProvider,
   *   ... etc
   * }]
   */

  // This list can be used to, e.g., show the "login options" to the user to let him choose
  // what EOS login method he wants to use.

  // We just take the one we have as if the user has selected that
  @getter selectedProvider: WalletProvider | '' = ''

  @getter wallet: Wallet | false = false
  @getter walletState: WalletState | false = false

  get loginStatus() {
    const login = ['Login', 'arrow-right', false]
    if (!this.wallet && !this.walletState) return login
    else if (this.walletState && this.walletState.authenticating)
      return ['Authenticating', 'spinner', true]
    else if (this.walletState && this.walletState.connecting)
      return ['Connecting', 'spinner', true]
    else if (this.walletState && this.walletState.accountFetching)
      return ['Fetching', 'spinner', true]
    else if (this.wallet && this.wallet.auth)
      return [this.wallet.auth.accountName, 'power-off', false]
    else return login
  }

  // actions
  @action async initLogin(provider: WalletProvider) {
    // We set the selected provider state
    this.setProvider(provider)

    // When user selects the wallet provider, we initiate the `Wallet` with it:
    const wallet = this.accessContext.initWallet(provider)

    // subscribe and set the current Wallet State
    wallet.subscribe(walletState => {
      if (walletState) this.setWalletState(walletState)
    })

    // Now we have an instance of `wallet` that is tracked by our `accessContext`.
    await wallet.connect()
    // wallet.connected === true

    // Now that we are connected, lets authenticate (in case of a Scatter app,
    // it does it right after connection, so this is more for the state tracking
    // and for WAL to fetch the EOS account data for us)
    await wallet.login()
    // wallet.authenticated === true

    this.setWallet(wallet)

    // Now that we have a wallet that is connected, logged in and have account data available,
    // you can use it to sign transactions using the `eosjs` API instance that is automatically
    // created and maintained by the wallet.
    return
  }

  @action async logout() {
    if (this.wallet) {
      this.wallet.logout()
      this.setWallet(false)
      this.setWalletState(false)
    }
  }

  // mutations
  @mutation setProvider(provider: WalletProvider) {
    this.selectedProvider = provider
  }

  @mutation setWallet(wallet: Wallet | false) {
    this.wallet = wallet
  }

  @mutation setWalletState(state: WalletState | false) {
    this.walletState = state
  }
}
export const eosTransit = EosTransitModule.ExtractVuexModule(EosTransitModule)
