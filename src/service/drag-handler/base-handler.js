import { Delegator } from './delegator'

export class BaseHandler extends Delegator {
  constructor ({dh, service, dragModel, options = {}}) {
    super()
    this.dh = dh
    this.dragModel = dragModel
    this.logging = service.logging
    this.service = service
    this.logger = options.logger || console
    this.options = options

    this.delegateCtx(service)
    this.delegateMdl(dragModel)

    this.configDelegates({
      props: ['drake', 'eventBus'],
      methods: ['getModel']
    })
  }

  delegateMdl (dragModel) {
    this.delegateProps('dragModel', ['sourceModel', 'targetModel', 'dragIndex', 'dropIndex'])
  }

  delegateCtx (service) {
    this.delegateFor('dh', {props: ['eventBus', 'name', 'modelManager'], methods: ['findModelForContainer']})
  }

  configDelegates ({props = [], methods = []}) {
    if (!this.dh) return
    this.delegateFor('dh', {methods, props})
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
