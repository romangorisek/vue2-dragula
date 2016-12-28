import { Delegator } from './delegator'

export class BaseHandler extends Delegator {
  constructor ({dh, service, dragModel, options = {}}) {
    super()

    if (dh) {
      this.dh = dh
      this.modelHandler = dh.modelHandler
      this.dragulaEventHandler = dh.dragulaEventHandler
    }

    this.dragModel = dragModel
    this.logging = service.logging
    this.service = service
    this.logger = options.logger || console
    this.options = options
    this.configDelegates()
  }

  configDelegates () {
    this.delegateFor('service', {props: ['eventBus', 'name', 'modelManager'], methods: ['findModelForContainer', 'domIndexOf']})
    this.delegateFor('dragModel', {props: ['sourceModel', 'targetModel', 'dragIndex', 'dropIndex']})
  }

  get clazzName () {
    return this.constructor.name
    // throw new Error('BaseHandler Subclass must override clazzName getter')
  }

  get shouldLog () {
    return this.logging && this.logging.dragHandler
  }

  log (event, ...args) {
    if (!this.shouldLog) return
    this.logger.log(`${this.clazzName} [${this.name}] :`, event, ...args)
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

  getModel (container) {
    return this.modelManager.createFor({
      name: this.name,
      logging: this.logging,
      model: this.findModelForContainer(container, this.drake)
    })
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
