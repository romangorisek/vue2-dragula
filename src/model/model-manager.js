export class ModelManager {
  constructor (opts = {}) {
    if (Array.isArray(opts)) {
      opts = {
        model: opts
      }
    }
    this.opts = opts
    this.name = opts.name
    this.groupProp = opts.groupProp || 'group'

    this.modelRef = opts.model || []
    this.model = this.createModel(this.modelRef)

    this.logging = opts.logging
    this.log('CREATE', opts)
  }

  get clazzName () {
    return this.constructor.name || 'ModelManager'
  }

  get shouldLog () {
    return this.logging && this.logging.modelManager
  }

  log (event, ...args) {
    if (!this.shouldLog) return
    console.log(`${this.clazzName} [${this.name}] :`, event, ...args)
  }

  undo () {
    this.log('undo', 'not yet implemented')
  }

  redo () {
    this.log('redo', 'not yet implemented')
  }

  at (index) {
    return this.model.get ? this.model.get(index) : this.model[index]
  }

  clear () {
    this.model = this.createModel()
  }

  createModel (model) {
    return this.model || model || []
  }

  createFor (opts = {}) {
    return new ModelManager(opts)
  }

  removeAt ({indexes}) {
    const index = indexes.drag
    this.log('removeAt', {
      model: this.model,
      index
    })
    return this.model.splice(index, 1)
  }

  insertAt ({indexes, models}) {
    const index = indexes.drop
    const dropModel = models.transit
    this.log('insertAt', {
      model: this.model,
      index,
      dropModel
    })
    return this.model.splice(index, 0, dropModel)
  }

  move ({indexes}) {
    this.log('move', {
      model: this.model,
      indexes
    })
    const insertModel = this.model.splice(indexes.drag, 1)[0]
    return this.model.splice(indexes.drop, 0, insertModel)
  }
}
