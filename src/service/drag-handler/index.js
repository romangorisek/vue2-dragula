import { BaseHandler } from './base-handler'
import { DragModel } from './drag-model'
import { defaults } from '../defaults'

export { DragulaEventHandler } from './dragula-event-handler'
export { ModelHandler } from './model-handler'

function createModelHandler ({dh, service, options = {}}) {
  // console.log('createModelHandler', dh, options, defaults)
  const factory = options.createModelHandler || defaults.createModelHandler
  return factory({dh, service, options})
}

function createDragulaEventHandler ({dh, service, options = {}}) {
  // console.log('createDragulaEventHandler', dh, options, defaults)
  const factory = options.createDragulaEventHandler || defaults.createDragulaEventHandler
  return factory({dh, service, options})
}

export class DragHandler extends BaseHandler {
  constructor ({service, name, drake, options = {}}) {
    super({service, options})
    // this.dragElm = null
    this.drake = drake
    this.name = name
    this.dragModel = new DragModel()

    this.configModelHandler()
    this.configEventHandler()
  }

  get args () {
    return {
      dh: this,
      name: this.name,
      drake: this.drake,
      service: this.service,
      dragModel: this.dragModel,
      options: this.options
    }
  }

  // TODO: avoid delegates here!
  configModelHandler () {
    this.modelHandler = createModelHandler(this.args)
  }

  // TODO: reference dragulaEventHandler from service to avoid delegates!?
  // pass dragulaEventHandler
  configEventHandler () {
    this.dragulaEventHandler = createDragulaEventHandler(Object.assign(this.args, {
      dragulaEventHandler: this.dragulaEventHandler
    }))

    this.delegateFor('dragulaEventHandler', ['remove', 'drag', 'drop'])
  }

  get clazzName () {
    return this.constructor.name || 'DragHandler'
  }
}
