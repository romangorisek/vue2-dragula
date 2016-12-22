export class Logger {
  constructor (options) {
    this.options = options
    this.logging = options.logging
  }

  plugin (...args) {
    if (!this.logging) return
    if (!this.logging.plugin) return
    console.log('vue-dragula plugin', ...args)
  }

  serviceConfig (...args) {
    if (!this.logging) return
    if (!this.logging.service) return
    console.log('vue-dragula service config: ', ...args)
  }

  dir (...args) {
    if (!this.logging) return
    if (!this.logging.directive) return
    console.log('v-dragula directive', ...args)
  }
}
