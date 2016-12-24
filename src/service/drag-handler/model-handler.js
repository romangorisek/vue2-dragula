import { BaseHandler } from './base-handler'
import { waitForTransition } from '../utils'
import { DropModelHandler } from './drop-model/handler'

export class ModelHandler extends BaseHandler {
  constructor ({dh, service, dragModel, options}) {
    super({dh, service, dragModel, options})
  }

  get clazzName () {
    return this.constructor.name || 'ModelHandler'
  }

  get models () {
    return {
      models: {
        source: this.sourceModel
      }
    }
  }

  context (ctx) {
    return Object.assign(ctx, this.models, this.indexes)
  }

  notCopy ({ctx}) {
    if (!ctx.noCopy) return
    waitForTransition(() => {
      ctx = this.context(ctx)
      this.sourceModel.removeAt(ctx)
    })
  }

  removeModel (ctx) {
    ctx = this.context(ctx)
    this.log('removeModel', ctx)
    this.sourceModel.removeAt(ctx)
  }

  insertModel (ctx) {
    ctx = this.context(ctx)
    this.log('insertModel', ctx)
    this.targetModel.insertAt(ctx)
    this.emit('insertAt', ctx)
  }

  dropModel (ctx) {
    const { containers } = ctx
    this.log('dropModel', ctx)
    ctx = Object.assign(ctx, this.indexes)

    containers.target === containers.source ? this.dropModelSame(ctx) : this.dropModelTarget(ctx)
  }

  dropModelSame (ctx) {
    ctx = this.context(ctx)
    this.log('dropModelSame', ctx)
    this.sourceModel.move(ctx)
  }

  dropModelTarget (ctx) {
    new DropModelHandler({dh: this.dh, service: this.service, ctx}).handle()
  }
}
