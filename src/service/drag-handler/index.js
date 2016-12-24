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
    this.dragIndex = null
    this.dropIndex = null
    this.sourceModel = null

    this.dragElm = null
    this.drake = drake
    this.name = name

    const dragModel = new DragModel()

    const args = {dh: this, service, dragModel, options}
    this.modelHandler = createModelHandler(args)

    // delegate methods to modelHandler
    for (let name of ['removeModel', 'insertModel', 'notCopy', 'dropModel', 'dropModelSame']) {
      this[name] = this.modelHandler[name].bind(this.modelHandler)
    }

    this.dragulaEventHandler = createDragulaEventHandler(args)

    // delegate methods to dragulaEventHandler
    for (let name of ['remove', 'drag', 'drop']) {
      this[name] = this.dragulaEventHandler[name].bind(this.dragulaEventHandler)
    }
  }

  get clazzName () {
    return this.constructor.name || 'DragHandler'
  }

  getModel (container) {
    return this.modelManager.createFor({
      name: this.name,
      drake: this.drake,
      logging: this.logging,
      model: this.findModelForContainer(container, this.drake)
    })
  }

  cancelDrop (ctx) {
    if (this.targetModel) return
    this.log('No targetModel could be found for target:', ctx.containers.target, ctx)
    this.log('in drake:', this.drake)
    this.drake.cancel(true)
  }
}
