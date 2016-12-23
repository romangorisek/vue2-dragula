import { DropModelHandler } from './drop-model/handler'
import { BaseHandler } from './base-handler'
import { defaults } from './defaults'

function createModelHandler ({dh, options}) {
  const factory = options.createModelHandler || defaults.createModelHandler
  return factory(dh, options)
}

function createDragulaEventHandler ({dh, options}) {
  const factory = options.createDragulaEventHandler || defaults.DragulaEventHandler
  return factory(dh, options)
}

export class DragHandler extends BaseHandler {
  constructor ({ctx, name, drake, options}) {
    super({ctx, options})
    this.dragIndex = null
    this.dropIndex = null
    this.sourceModel = null

    this.dragElm = null
    this.drake = drake
    this.name = name

    const args = {dh: this, ctx, options}
    this.modelHandler = createModelHandler(args)
    this.dragulaEventHandler = createDragulaEventHandler(args)

    // delegate methods to modelHandler
    for (let name of ['removeModel', 'insertModel', 'notCopy', 'dropModelSame']) {
      this[name] = this.modelHandler[name].bind(this.modelHandler)
    }

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

  dropModelTarget (ctx) {
    new DropModelHandler({dh: this, ctx}).handle()
  }
}
