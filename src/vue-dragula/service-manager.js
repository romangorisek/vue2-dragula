import { defaults } from '../defaults'
import { defaults as dirDefaults } from './defaults'

export class ServiceManager {
  constructor ({Vue, options, eventBus, log}) {
    this.log = log.dir
    this.log('create ServiceManager', options)
    this.Vue = Vue
    this.options = options
    this.buildService = options.createService || defaults.createService
    console.log('creating Eventbus')
    this.createEventbus()

    if (!this.buildService) {
      throw new Error('ServiceManager:: No function to build Service')
    }

    // global service
    console.log('building global service')
    this.appService = this.buildService({
      name: 'global.dragula',
      eventBus: this.eventBus,
      drakes: options.drakes,
      options
    })
  }

  createEventbus () {
    console.log('createEventbus')
    let eventBusFactory = this.options.createEventBus || dirDefaults.createEventBus
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
        this.log('trying to find and use component service')

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




