import { BaseHandler } from '../base-handler'
import { DropModelBuilder } from './builder'

export class DropModelHandler extends BaseHandler {
  constructor ({dh, ctx}) {
    super({dh, ctx})

    // delegate methods to modelHandler
    for (let name of ['notCopy', 'insertModel', 'cancelDrop']) {
      this[name] = this.dh[name].bind(this.dh)
    }
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

  handle () {
    this.log('dropModelTarget', this.ctx)
    this.setNoCopy()

    const ctx = Object.assign(this.ctx, this.models(), {noCopy: this.noCopy})

    this.notCopy({ctx})
    this.cancelDrop(ctx)
    this.insertModel(ctx)
  }
}
