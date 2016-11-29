const raf = window.requestAnimationFrame
const waitForTransition = raf
  ? function (fn) {
    raf(() => {
      raf(fn)
    })
  }
  : function (fn) {
    window.setTimeout(fn, 50)
  }

export class DragHandler {
  constructor({ctx, name, drake, options}) {
    this.dragElm = null
    this.dragIndex = null
    this.dropIndex = null
    this.sourceModel = null
    this.logging = ctx.logging
    this.ctx = ctx
    this.serviceName = ctx.name
    this.modelManager = ctx.modelManager
    this.drake = drake
    this.name = name
    this.eventBus = ctx.eventBus
    this.findModelForContainer = ctx.findModelForContainer.bind(ctx)
    this.domIndexOf = ctx.domIndexOf.bind(ctx)
  }

  log(event, ...args) {
    if (!this.logging) return
    if (!this.logging.dragHandler) return
    console.log(`DragHandler [${this.name}] :`, event, ...args)
  }

  removeModel() {
    this.log('removeModel', {
      sourceModel: this.sourceModel,
      dragIndex: this.dragIndex
    })
    this.sourceModel.removeAt(this.dragIndex)
  }

  dropModelSame() {
    this.log('dropModelSame', {
      sourceModel: this.sourceModel,
      dragIndex: this.dragIndex,
      dropIndex: this.dropIndex
    })

    this.sourceModel.move({
      dropIndex: this.dropIndex,
      dragIndex: this.dragIndex
    })
  }

  insertModel(targetModel, dropElmModel) {
    this.log('insertModel', {
      targetModel: targetModel,
      dropElmModel: dropElmModel
    })
    targetModel.insertAt(this.dropIndex, dropElmModel)
  }

  notCopy() {
    waitForTransition(() => {
      this.sourceModel.removeAt(this.dragIndex)
    })
  }

  cancelDrop(target) {
    this.log('No targetModel could be found for target:', target)
    this.log('in drake:', this.drake)
    this.drake.cancel(true)
  }


  dropModelTarget(dropElm, target, source) {
    this.log('dropModelTarget', dropElm, target, source)
    let notCopy = this.dragElm === dropElm
    let targetModel = this.getTargetModel(target)
    let dropElmModel = notCopy ? this.dropElmModel : this.jsonDropElmModel

    if (notCopy) {
      this.notCopy()
    }

    if (!targetModel) {
      return this.cancelDrop(target)
    }

    this.insertModel(targetModel, dropElmModel)
  }

  dropModel(dropElm, target, source) {
    this.log('dropModel', dropElm, target, source)
    target === source ? this.dropModelSame() : this.dropModelTarget(dropElm, target, source)
  }

  emit(eventName, opts = {}) {
    opts.model = this.sourceModel
    opts.name = this.name
    let serviceEventName = `${this.serviceName}:${eventName}`

    this.log('emit', serviceEventName, eventName, opts)
    this.eventBus.$emit(eventName, opts)
    this.eventBus.$emit(serviceEventName, opts)
  }

  getModel(location) {
    return this.modelManager.createFor(this.findModelForContainer(location, this.drake))
  }

  remove (el, container, source) {
    this.log('remove', el, container, source)
    if (!this.drake.models) {
      this.log('Warning: Can NOT remove it. Must have models:', this.drake.models)
      return
    }

    this.sourceModel = this.getModel(source)
    this.removeModel()
    this.drake.cancel(true)

    this.emit('removeModel', {
      el,
      source,
      dragIndex: this.dragIndex
    })
  }

  drag (el, source) {
    this.log('drag', el, source)
    this.dragElm = el
    this.dragIndex = this.domIndexOf(el, source)
  }

  drop (dropEl, target, source) {
    this.log('drop', dropEl, target, source)
    if (!this.drake.models || !target) {
      this.log('Warning: Can NOT drop it. Must have either models:', this.drake.models, ' or target:', target)
      return
    }
    this.dropIndex = this.domIndexOf(dropEl, target)
    this.sourceModel = this.getModel(source)
    this.dropModel(dropEl, target, source)

    this.emit('dropModel', {
      target,
      source,
      el: dropEl,
      dropIndex: this.dropIndex
    })
  }

  get dropElmModel() {
    return this.sourceModel.at(this.dragIndex)
  }

  get jsonDropElmModel() {
    let model = this.sourceModel.at(this.dragIndex)
    return JSON.parse(JSON.stringify(model))
  }
}
