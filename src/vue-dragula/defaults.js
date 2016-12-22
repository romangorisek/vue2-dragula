import { DragulaService } from '../service'

export default {
  createService: function ({name, eventBus, drakes, options}) {
    return new DragulaService({
      name,
      eventBus,
      drakes,
      options
    })
  },
  createEventBus: function (Vue) {
    return new Vue()
  }
}
