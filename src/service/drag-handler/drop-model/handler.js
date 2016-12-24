import { BaseHandler } from '../base-handler'
import { DropModelBuilder } from './builder'

export class DropModelHandler extends BaseHandler {
  constructor ({dh, service, ctx}) {
    super({dh, service})
    this.ctx = ctx

    // delegate methods to modelHandler
    this.delegateFor('dh', {methods: ['notCopy', 'insertModel', 'cancelDrop']})
  }

  get clazzName () {
    return this.constructor.name || 'DropModelHandler'
  }

  setNoCopy () {
    this.noCopy = this.dragElm === this.ctx.element
  }

  setTargetModel () {
    this.targetModel = this.getModel(this.ctx.containers.target)
  }

  setDropModel () {
    this.dropModel = new DropModelBuilder({
      dh: this.dh,
      noCopy: this.noCopy
    }).model
  }

  models () {
    this.setTargetModel()
    this.setDropModel()
    return {
      models: {
        target: this.targetModel,
        drop: this.dropModel
      }
    }
  }

  cancelDrop (ctx) {
    if (this.targetModel) return
    this.log('No targetModel could be found for target:', ctx.containers.target, ctx)
    this.log('in drake:', this.drake)
    this.drake.cancel(true)
  }

  handle () {
    this.log('dropModelTarget', this.ctx)
    this.setNoCopy()

    const ctx = Object.assign(this.ctx, this.models(), {noCopy: this.noCopy})

    this.notCopy({ctx})
    this.cancelDrop(ctx)
    this.insertModel(ctx)
  }
}
