export class BaseHandler {
  constructor ({dh, ctx, options}) {
    this.dh = dh
    this.logging = ctx.logging
    this.ctx = ctx
    this.options = options
    this.configDelegates({
      props: ['drake', 'dragIndex', 'dropIndex', 'sourceModel', 'eventBus'],
      methods: ['getModel']
    })
  }

  configDelegates ({props = [], methods = []}) {
    if (!this.dh) return

    // delegate properties
    for (let name of props) {
      this[name] = this.dh[name]
    }

    // delegate methods (incl getters/setters)
    for (let name of methods) {
      this[name] = this.dh[name].bind(this.dh)
    }
  }

  get clazzName () {
    throw new Error('BaseHandler Subclass must override clazzName getter')
  }

  get shouldLog () {
    return this.logging && this.logging.dragHandler
  }

  log (event, ...args) {
    if (!this.shouldLog) return
    console.log(`${this.clazzName} [${this.name}] :`, event, ...args)
  }

  createCtx ({el, source, target, models}) {
    return {
      element: el,
      containers: {
        source,
        target
      },
      indexes: this.indexes,
      models
    }
  }

  get indexes () {
    return {
      indexes: {
        source: this.dragIndex,
        target: this.dropIndex
      }
    }
  }

  emit (eventName, opts = {}) {
    opts.sourceModel = this.sourceModel
    opts.name = this.name
    let serviceEventName = `${this.serviceName}:${eventName}`

    this.log('emit', serviceEventName, eventName, opts)
    this.eventBus.$emit(eventName, opts)
    this.eventBus.$emit(serviceEventName, opts)
  }
}
