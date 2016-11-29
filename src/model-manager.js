export class ModelManager {
  constructor(opts = {}) {
    this.log('create', opts)
    this.opts = opts
    this.name = opts.name
    this.model = opts.model || this.createModel()
    this.history = opts.history || this.createHistory()
    this.logging = opts.logging
  }

  log(event, ...args) {
    if (!(this.logging && this.logging.modelManager)) return
    console.log(`ModelManager [${this.name}] :`, event, ...args)
  }

  undo() {
    this.log('undo', 'not yet implemented')
  }

  redo() {
    this.log('redo', 'not yet implemented')
  }

  at(index) {
    return this.model[this.dragIndex]
  }

  createModel() {
    return this.model || [];
  }

  createHistory() {
    return this.history || [];
  }

  createFor(model) {
    return new ModelManager({ model })
  }

  removeAt(index) {
    this.log('removeAt', {
      model: this.model,
      index
    })
    this.model.splice(this.Index, 1)
  }

  insertAt(index, dropModel) {
    this.log('insertAt', {
      model: this.model,
      index,
      dropModel
    })
    this.model.splice(index, 0, dropModel)
  }

  move({dragIndex, dropIndex}) {
    this.log('move', {
      model: this.model,
      dragIndex,
      dropIndex
    })

    this.model.splice(dropIndex, 0, this.model.splice(dragIndex, 1)[0])
  }
}