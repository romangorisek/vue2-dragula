import { UnBinder, Binder, Updater } from './'

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export class Creator {
  // TODO: Allow for customisation via options containing factory methods
  constructor ({Vue, serviceManager, name = 'globalDrake', options, log}) {
    console.log('Creator', serviceManager, options)
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
    console.log('createDirClass', name, options)    
    const DefaultClazz = this.default[name]
    const defaultCreator = () => { return new DefaultClazz(this.default.args) }

    const factoryFunctionName = 'create' + capitalize(name)
    const customFun = this.options.directive ? this.options.directive[factoryFunctionName] : null
    const updaterClazz = customFun || defaultCreator
    return updaterClazz(this.default.args)
  }

  updateDirective ({container, binding, vnode, oldVnode, ctx}) {
    const newValue = vnode
      ? binding.value // Vue 2
      : container // Vue 1
    if (!newValue) { return }

    this.updater.execute({container, vnode, binding, newValue, oldVnode, ctx})
  }

  create () {
    const that = this

    this.Vue.directive('dragula', {
      params: ['drake', 'service'],

      bind (container, binding, vnode) {
        that.log('BIND', container, binding, vnode)

        that.binder.execute({container, binding, vnode, ctx: that})
      },

      update (container, binding, vnode, oldVnode) {
        that.log('UPDATE', container, binding, vnode)
        // Vue 1
        if (that.Vue.version === 1) {
          that.updateDirective({container, binding, vnode, oldVnode, ctx: that})
        }
      },

      componentUpdated (container, binding, vnode, oldVnode) {
        that.log('COMPONENT UPDATED', container, binding, vnode)
      },

      inserted (container, binding, vnode, oldVnode) {
        that.log('INSERTED', container, binding, vnode)
        // Vue 2
        that.updateDirective({container, binding, vnode, oldVnode, ctx: that})
      },

      unbind (container, binding, vnode) {
        that.log('UNBIND', container, binding, vnode)
        that.unbinder.execute({container, binding, vnode, ctx: that})
      }
    })
  }
}

