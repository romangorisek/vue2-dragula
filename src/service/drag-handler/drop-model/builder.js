import { Delegator } from '../delegator'

export class DropModelBuilder extends Delegator {
  constructor ({dh, noCopy}) {
    super()
    console.log('create DropModelBuilder', dh)
    this.dh = dh
    this.noCopy = noCopy
    this.dragModel = dh.dragModel
    this.configDelegates()
    console.log('delegates for', this.dragModel, {sourceModel: this.sourceModel, dragIndex: this.dragIndex})
  }

  configDelegates () {
    this.delegateFor('dragModel', {props: ['sourceModel', 'dragIndex']})
  }

  get model () {
    return this.noCopy ? this.dropElmModel() : this.jsonDropElmModel()
  }

  dropElmModel () {
    return this.sourceModel.at(this.dragIndex)
  }

  jsonDropElmModel () {
    let model = this.dropElmModel()
    let stringable = model ? model.model || model.stringable : model
    return JSON.parse(JSON.stringify(stringable || model))
  }
}
