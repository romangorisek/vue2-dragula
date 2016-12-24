import { DragulaService } from './service'
import { TimeMachine } from './model/time-machine'

export const defaults = {
  createTimeMachine (opts) {
    return new TimeMachine(opts)
  },
  createService ({name, eventBus, drakes, options}) {
    // log('default createService', {name, eventBus, drakes, options})
    return new DragulaService({
      name,
      eventBus,
      drakes,
      options
    })
  }
}
