export const GroupOps = {
  // only insertAt operation needed to switch
  // group of item moved
  removeAt ({indexes, containers}) {
  },
  insertGroupOf (targetContainer) {
    return targetContainer.id
  },

  setGroup (dropModel, group) {
    dropModel[this.groupProp] = group
  },

  insertAt ({indexes, models, containers}) {
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

    const group = this.insertGroupOf(containers.target)
    this.setGroup(dropModel, group)

    const newModel = this.createModel().concat(before, dropModel, inclAfter)

    this.actionUpdateModel(newModel)
    return newModel
  }
}
