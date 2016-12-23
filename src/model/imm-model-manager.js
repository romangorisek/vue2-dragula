import { ModelManager } from './service/model-manager'
import { defaults } from './defaults'
const { createTimeMachine } = defaults

export class ImmutableModelManager extends ModelManager {
  constructor (opts = {}) {
    super(opts)
    this.timeOut = opts.timeOut || 800
    let createTimeMachineFac = opts.createTimeMachine || createTimeMachine
    this.timeMachine = createTimeMachineFac(Object.assign(opts, {
      model: this.model,
      modelRef: this.modelRef
    }))
  }

  get clazzName () {
    return this.constructor.name || 'ImmutableModelManager'
  }

  get model () {
    return this.timeMachine ? this.timeMachine.model : this._model
  }

  get history () {
    return this.timeMachine.history
  }

  get timeIndex () {
    return this.timeMachine.timeIndex
  }

  timeTravel (index) {
    return this.timeMachine.timeTravel(index)
  }

  undo () {
    // this.log('UNDO', this.timeMachine)
    this.timeMachine.undo()
    return this
  }

  redo () {
    // this.log('REDO', this.timeMachine)
    this.timeMachine.redo()
    return this
  }

  addToHistory (model) {
    this.timeMachine.addToHistory(model)
    return this
  }

  // override with Immutable
  createModel (model) {
    return model || []
  }

  // TODO: add to history!?
  createFor (opts = {}) {
    return new ImmutableModelManager(opts)
  }

  at (index) {
    console.log('find model at', index, this.model)
    return super.at(index)
  }

  isEmpty () {
    return this.model.length === 0
  }

  get first () {
    return this.at(0)
  }

  get last () {
    return this.at(this.model.length - 1)
  }

  actionUpdateModel (newModel) {
    setTimeout(() => {
      this.addToHistory(newModel)
    }, this.timeOut || 800)
  }

  removeAt ({indexes}) {
    const index = indexes.drag
    this.log('removeAt', {
      model: this.model,
      index
    })
    // create new model with self excluded
    const before = this.model.slice(0, index)
    const exclAfter = this.model.slice(index + 1)

    this.log('removeAt: concat', before, exclAfter)
    const newModel = this.createModel().concat(before, exclAfter)

    this.actionUpdateModel(newModel)
    return newModel
  }

  insertAt ({indexes, models}) {
    const index = indexes.drop
    const dropModel = models.transit

    this.log('insertAt', {
      model: this.model,
      index,
      dropModel
    })
    // create new model with new inserted
    const before = this.model.slice(0, index)
    const inclAfter = this.model.slice(index)
    this.log('insertAt: concat', before, dropModel, inclAfter)

    const newModel = this.createModel().concat(before, dropModel, inclAfter)

    this.actionUpdateModel(newModel)
    return newModel
  }

  move ({indexes}) {
    this.log('move', {
      model: this.model,
      indexes
    })
    this.timeMachine.undo()
    return this
  }
}
