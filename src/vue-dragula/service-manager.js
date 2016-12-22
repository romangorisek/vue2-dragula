import { defaults } from './defaults'

export class ServiceManager {
  constructor ({Vue, options, eventBus, log}) {
    this.log = log.dir
    this.Vue = Vue
    this.options = options
    this.createService = options.createService || defaults.createService
    this.createEventbus()

    // global service
    this.appService = this.createService({
      name: 'global.dragula',
      eventBus: this.eventBus,
      drakes: options.drakes,
      options
    })
  }

  createEventbus () {
    let eventBusFactory = this.options.createEventBus || defaults.createEventBus
    this.eventBus = eventBusFactory(this.Vue, this.options) || new this.Vue()
    if (!this.eventBus) {
      console.warn('Eventbus could not be created')
      throw new Error('Eventbus could not be created')
    }
  }

  findService (name, vnode, serviceName) {
    // first try to register on DragulaService of component
    if (vnode) {
      let dragula = vnode.context.$dragula
      if (dragula) {
        this.logDir('trying to find and use component service')

        let componentService = dragula.service(serviceName)
        if (componentService) {
          this.log('using component service', componentService)
          return componentService
        }
      }
    }
    this.log('using global service', this.appService)
    return this.appService
  }
}




