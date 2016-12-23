import { BaseHandler } from './base-handler'
import { waitForTransition } from './utils'

export class ModelHandler extends BaseHandler {
  constructor ({dh, ctx, options}) {
    super({dh, ctx, options})
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

  dropModel (ctx) {
    const { containers } = ctx
    this.log('dropModel', ctx)
    ctx = Object.assign(ctx, this.indexes)

    containers.target === containers.source ? this.dropModelSame(ctx) : this.dropModelTarget(ctx)
  }

  removeModel (ctx) {
    ctx = this.context(ctx)
    this.log('removeModel', ctx)
    this.sourceModel.removeAt(ctx)
  }

  dropModelSame (ctx) {
    ctx = this.context(ctx)
    this.log('dropModelSame', ctx)
    this.sourceModel.move(ctx)
  }

  insertModel (ctx) {
    ctx = this.context(ctx)
    this.log('insertModel', ctx)
    this.targetModel.insertAt(ctx)
    this.emit('insertAt', ctx)
  }

  notCopy ({ctx}) {
    if (!ctx.noCopy) return
    waitForTransition(() => {
      ctx = this.context(ctx)
      this.sourceModel.removeAt(ctx)
    })
  }
}
