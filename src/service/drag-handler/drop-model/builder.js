
export class DropModelBuilder {
  constructor ({dh, noCopy}) {
    this.dh = dh
    this.noCopy = noCopy
    this.sourceModel = dh.sourceModel
    this.dragIndex = dh.dragIndex
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
