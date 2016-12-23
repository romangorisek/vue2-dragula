import { ServiceManager } from './service-manager'
import { Dragula } from './dragula'
import { Creator } from './directive'
import { Logger } from './logger'

// function log (...msg) {
//   console.log(...msg)
// }

export const defaults = {
  createEventBus (Vue) {
    // log('default createEventBus', Vue)
    return new Vue()
  },
  createServiceManager ({Vue, options, log}) {
    return new ServiceManager({Vue, options, log})
  },
  createLogger (options) {
    return new Logger(options)
  },
  createDragula ({serviceManager, log}) {
    return new Dragula({serviceManager, log})
  },
  createCreator ({Vue, serviceManager, options, log}) {
    return new Creator({Vue, serviceManager, options, log})
  }
}
