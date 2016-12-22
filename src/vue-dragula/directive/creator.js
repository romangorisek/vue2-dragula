import { UnBinder, Binder, Updater } from './'

export default class Creator {
  // TODO: Allow for customisation via options containing factory methods
  constructor ({Vue, serviceManager, name = 'globalDrake', options, log}) {
    this.name = name
    this.Vue = Vue
    this.log = log.dir
    this.options = options
    this.execute = this.create.bind(this)

    this.default = {
      args: {serviceManager, name, log},
      updater: Updater,
      binder: Binder,
      unbinder: UnBinder
    }

    this.updater = this.createDirClass('updater', options)
    this.binder = this.createDirClass('binder', options)
    this.unbinder = this.createDirClass('unbinder', options)
  }

  // Allow options to have custom factory methods:
  // - updater
  // - binder
  // - unbinder
  createDirClass (name, options) {
    const DefaultClazz = this.default[name]
    const defaultCreator = () => { return new DefaultClazz(this.default.args) }
    const updaterClazz = this.options[name] || defaultCreator
    return updaterClazz(this.default.args)
  }

  updateDirective (container, binding, vnode, oldVnode) {
    const newValue = vnode
      ? binding.value // Vue 2
      : container // Vue 1
    if (!newValue) { return }

    this.updater.execute({container, vnode, binding, newValue, oldVnode})
  }

  create () {
    this.Vue.directive('dragula', {
      params: ['drake', 'service'],

      bind (container, binding, vnode) {
        this.log('BIND', container, binding, vnode)

        this.binder.execute({container, binding, vnode})
      },

      update (container, binding, vnode, oldVnode) {
        this.log('UPDATE', container, binding, vnode)
        // Vue 1
        if (this.Vue.version === 1) {
          this.updateDirective(container, binding, vnode, oldVnode)
        }
      },

      componentUpdated (container, binding, vnode, oldVnode) {
        this.log('COMPONENT UPDATED', container, binding, vnode)
      },

      inserted (container, binding, vnode, oldVnode) {
        this.log('INSERTED', container, binding, vnode)
        // Vue 2
        this.updateDirective(container, binding, vnode, oldVnode)
      },

      unbind (container, binding, vnode) {
        this.log('UNBIND', container, binding, vnode)
        this.unbinder.execute({container, binding, vnode})
      }
    })
  }
}

