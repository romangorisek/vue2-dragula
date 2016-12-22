export default class Dragula {
  constructor ({appService, createService, log}) {
    this.appService = appService
    this.log = this.log
    this.options = appService.options
    this.createService = createService

    // convenience functions on global service
    this.$service = {
      options: appService.setOptions.bind(appService),
      find: appService.find.bind(appService),
      eventBus: appService.eventBus
    }
    // add default drake on global app service
    this.$service.options('default', {})

    // alias
    this.createServices = this.createService
  }

  optionsFor (name, opts = {}) {
    this.service(name).setOptions(opts)
    return this
  }

  createService (serviceOpts = {}) {
    this.log('createService', serviceOpts)

    this._serviceMap = this._serviceMap || {}

    let names = serviceOpts.names || []
    let name = serviceOpts.name || []
    let drakes = serviceOpts.drakes || {}
    let drake = serviceOpts.drake
    let opts = Object.assign({}, this.options, serviceOpts)
    names = names.length > 0 ? names : [name]
    let eventBus = serviceOpts.eventBus || this.appService.eventBus
    if (!eventBus) {
      console.warn('Eventbus could not be created', eventBus)
    }

    this.log('names', names)
    for (let name of names) {
      let createOpts = {
        name,
        eventBus,
        options: opts
      }
      this.log('create DragulaService', name, createOpts)
      this._serviceMap[name] = this.createService(createOpts)

      // use 'default' drakes if none specified
      if (!drakes.default) {
        drakes.default = drake || true
      }

      this.drakesFor(name, drakes)
    }
    return this
  }

  drakesFor (name, drakes = {}) {
    this.log('drakesFor', name, drakes)
    let service = this.service(name)

    if (Array.isArray(drakes)) {
      // turn Array into object of [name]: true
      drakes = drakes.reduce((obj, name) => {
        obj[name] = true
        return obj
      }, {})
    }

    let drakeNames = Object.keys(drakes)
    for (let drakeName of drakeNames) {
      let drakeOpts = drakes[drakeName]
      if (drakeOpts === true) {
        drakeOpts = {}
      }

      service.setOptions(drakeName, drakeOpts)
    }
    return this
  }

  on (name, handlerConfig = {}) {
    this.log('on', name, handlerConfig)
    if (typeof name === 'object') {
      handlerConfig = name
      // add event handlers for all services
      let serviceNames = this.serviceNames

      if (!serviceNames || serviceNames.length < 1) {
        console.warn('vue-dragula: No services found to add events handlers for', this._serviceMap);
        return this
      }

      this.log('add event handlers for', serviceNames)
      for (let serviceName of serviceNames) {
        this.on(serviceName, handlerConfig)
      }
      return this
    }

    let service = this.service(name)
    if (!service) {
      console.warn(`vue-dragula: no service ${name} to add event handlers for`)
      return this
    }
    this.log('service.on', service, handlerConfig)
    service.on(handlerConfig)
    return this
  }

  get serviceNames () {
    return Object.keys(this._serviceMap)
  }

  get services () {
    return Object.values(this._serviceMap)
  }

  // return named service or first service
  service (name) {
    if (!this._serviceMap) return

    let found = this._serviceMap[name]
    this.log('lookup service', name, found)

    if (!found) {
      this.log('not found by name, get default')
      let keys = this.serviceNames
      if (keys) {
        found = this._serviceMap[keys[0]]
      }
    }
    return found
  }
}
