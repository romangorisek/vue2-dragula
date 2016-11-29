export class ModelManager {
  constructor(opts) {
    this.opts = opts
    this.model = opts.model || this.createModel()
  }

  at(index) {
    return this.model[this.dragIndex]
  }

  createModel() {
    return this.model || [];
  }

  createFor(model) {
    return new ModelManager({ model })
  }

  removeAt(index) {
    this.model.splice(this.Index, 1)
  }

  insertAt(index, dropModel) {
    this.model.splice(index, 0, dropModel)
  }

  move({dragIndex, dropIndex}) {
    this.model.splice(dropIndex, 0, this.model.splice(dragIndex, 1)[0])
  }
}