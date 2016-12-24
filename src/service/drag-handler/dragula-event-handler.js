import { BaseHandler } from './base-handler'

export class DragulaEventHandler extends BaseHandler {
  constructor ({dh, service, dragModel, options}) {
    super({dh, service, dragModel, options})
    this.domIndexOf = service.domIndexOf.bind(service)

    console.log('DragulaEventHandler: dh', this.dh)
    this.configDelegates({
      props: ['dragElm', 'drake'],
      methods: ['removeModel', 'dropModel']
    })
  }

  get clazzName () {
    return this.constructor.name || 'DragulaEventHandler'
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

    const ctx = this.createCtx({ el, source })
    this.sourceModel = this.getModel(source) // container
    this.removeModel(ctx)
    this.drake.cancel(true)

    this.emit('removeModel', ctx)
  }

  // :: dragula event handler
  // el was lifted from source
  drag (el, source) {
    this.log(':: DRAG', el, source)
    this.dragElm = el
    this.dragIndex = this.domIndexOf(el, source)
  }

  // :: dragula event handler
  // el was dropped into target before a sibling element, and originally came from source
  drop (el, target, source, sibling) {
    this.log(':: DROP', el, target, source)
    if (!this.drake.models || !target) {
      this.log('Warning: Can NOT drop it. Must have either models:', this.drake.models, ' or target:', target)
      return
    }
    this.dropIndex = this.domIndexOf(el, target)
    this.sourceModel = this.getModel(source) // container
    console.log('sourceModel', this.sourceModel, this.dh.sourceModel)

    const ctx = this.createCtx({el, target, source})
    this.dropModel(ctx)

    this.emit('dropModel', ctx)
  }
}
