import { BaseHandler } from './base-handler'

export class DragulaEventHandler extends BaseHandler {
  // BaseHandler sets up delegation to method and getters/setters
  constructor ({dh, service, dragModel, options}) {
    super({dh, service, dragModel, options})
    console.log('DragulaEventHandler: dh', this.dh)
  }

  configDelegates () {
    super.configDelegates()
    this.delegateFor('dh', {
      props: ['dragElm', 'drake']
    })

    this.delegateFor('modelHandler', {
      methods: ['removeModel', 'dropModel']
    })
  }

  get clazzName () {
    return this.constructor.name || 'DragulaEventHandler'
  }

  setModel (modelName, source) {
    this[modelName] = this.getModel(source) // container
  }

  setIndex (indexName, {el, source}) {
    this[indexName] = this.domIndexOf(el, source)
  }

  // :: dragula event handler
  // el was being dragged but it got nowhere and it was removed from the DOM
  // Its last stable parent was container
  // originally came from source
  remove (el, container, source) {
    this.log(':: REMOVE', el, container, source)
    if (!this.drake.models) {
      this.log('Warning: Can NOT remove it. Must have models:', this.drake.models)
      return
    }
    this.setSourceModel(source)
    const ctx = this.createCtx({ el, source })

    this.removeModel(ctx)
    this.drake.cancel(true)

    this.emit('removeModel', ctx)
  }

  // :: dragula event handler
  // el was lifted from source
  drag (el, source) {
    this.log(':: DRAG', el, source)
    this.dragElm = el
    this.setIndex('dragIndex', {el, source})
    this.log('DRAGGED: dragIndex = ', this.dragIndex)
    this.log('dragModel', this.dragModel)
  }

  // :: dragula event handler
  // el was dropped into target before a sibling element, and originally came from source
  drop (el, target, source, sibling) {
    this.log(':: DROP', el, target, source)
    if (!this.drake.models || !target) {
      this.log('Warning: Can NOT drop it. Must have either models:', this.drake.models, ' or target:', target)
      return
    }
    this.setIndex('dropIndex', {el, source})
    this.setModel('sourceModel', source)
    console.log('sourceModel', this.sourceModel, this.dh.sourceModel)

    const ctx = this.createCtx({el, target, source})
    this.dropModel(ctx)

    this.emit('dropModel', ctx)
  }
}
