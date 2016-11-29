export class ModelManager {
  constructor(opts = {}) {
    this.log('create', opts)
    this.opts = opts
    this.name = opts.name
    this.model = this.createModel(opts.model || [])
    this.history = opts.history || this.createHistory()
    this.logging = opts.logging
    this.timeIndex = 0
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

  addToHistory(model) {
    this.history.push(model)
    this.timeIndex++
  }

  at(index) {
    return this.model[index]
  }

  createModel(model) {
    return this.model || model || [];
  }

  createHistory() {
    return this.history || [];
  }

  createFor(opts = {}) {
    return new ModelManager(opts)
  }

  removeAt(index) {
    this.log('removeAt', {
      model: this.model,
      index
    })
    return this.model.splice(index, 1)
  }

  insertAt(index, dropModel) {
    this.log('insertAt', {
      model: this.model,
      index,
      dropModel
    })
    return this.model.splice(index, 0, dropModel)
  }

  move({dragIndex, dropIndex}) {
    this.log('move', {
      model: this.model,
      dragIndex,
      dropIndex
    })

    return this.model.splice(dropIndex, 0, this.model.splice(dragIndex, 1)[0])
  }
}