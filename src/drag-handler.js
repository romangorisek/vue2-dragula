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
    this.name = ctx.name
    this.drake = drake
    this.name = name
    this.eventBus = ctx.eventBus
    this.findModelForContainer = ctx.findModelForContainer
    this.domIndexOf = ctx.domIndexOf
  }

  log(event, ...args) {
    if (!this.logging) return
    if (!this.logging.dragHandler) return
    console.log(`DragHandler [${this.name}] :`, event, ...args)
  }

  removeModel(el, container, source) {
    this.log('removeModel', el, container, source)
    this.sourceModel.splice(this.dragIndex, 1)
  }

  dropModelSame(dropElm, target, source) {
    this.log('dropModelSame', dropElm, target, source)
    this.sourceModel.splice(this.dropIndex, 0, this.sourceModel.splice(this.dragIndex, 1)[0])
  }

  insertModel(targetModel, dropElmModel) {
    this.log('insertModel', targetModel, dropElmModel)
    targetModel.splice(this.dropIndex, 0, dropElmModel)
  }

  dropModelTarget(dropElm, target, source) {
    this.log('dropModelTarget', dropElm, target, source)
    let notCopy = this.dragElm === dropElm
    let targetModel = this.findModelForContainer(target, this.drake)
    let dropElmModel = notCopy ? this.dropElmModel : this.jsonDropElmModel

    if (notCopy) {
      waitForTransition(() => {
        this.sourceModel.splice(this.dragIndex, 1)
      })
    }
    this.insertModel(targetModel, dropElmModel)
    this.drake.cancel(true)
  }

  dropModel(dropElm, target, source) {
    this.log('dropModel', dropElm, target, source)
    target === source ? this.dropModelSame(dropElm, target, source) : this.dropModelTarget(dropElm, target, source)
  }


  remove (el, container, source) {
    this.log('remove', el, container, source)
    if (!this.drake.models) {
      return
    }
    this.sourceModel = this.findModelForContainer(source, this.drake)
    this.removeModel(el, container, source)
    this.drake.cancel(true)
    // TODO: extract/refactor
    this.eventBus.$emit('removeModel', this.name, el, source, this.dragIndex)
    this.eventBus.$emit(`${this.name}:removeModel`, this.name, el, source, this.dragIndex)
  }

  drag (el, source) {
    this.log('drag', el, source)
    this.dragElm = el
    this.dragIndex = this.domIndexOf(el, source)
  }

  drop (dropElm, target, source) {
    this.log('drop', dropElm, target, source)
    if (!this.drake.models || !target) {
      return
    }
    this.dropIndex = this.domIndexOf(dropElm, target)
    this.sourceModel = this.findModelForContainer(source, this.drake)
    this.dropModel(dropElm, target, source)
    // TODO: extract/refactor
    this.eventBus.$emit('dropModel', this.name, dropElm, target, source, this.dropIndex)
    this.eventBus.$emit(`${this.name}:dropModel`, this.name, dropElm, target, source, this.dropIndex)    
  }

  get dropElmModel() {
    return this.sourceModel[this.dragIndex]
  }

  get jsonDropElmModel() {
    return JSON.parse(JSON.stringify(this.sourceModel[this.dragIndex]))
  }
}




