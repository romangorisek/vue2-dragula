import { DragulaService } from '../service'
import { ServiceManager } from './service-manager'
import { Dragula } from './dragula'
import { Creator } from './directive'
import { Logger } from './logger'


function log (...msg) {
  console.log(...msg)
}

export const defaults = {
  createService: ({name, eventBus, drakes, options}) => {
    log('default createService', {name, eventBus, drakes, options})
    return new DragulaService({
      name,
      eventBus,
      drakes,
      options
    })
  },
  createEventBus: Vue => {
    log('default createEventBus', Vue)
    return new Vue()
  },
  createServiceManager: ({Vue, options, log}) => {
    return new ServiceManager({Vue, options, log})
  },
  createLogger: options => {
    return new Logger(options)
  },
  createDragula: ({serviceManager, log}) => {
    return new Dragula({serviceManager, log})
  },
  createDirectiveCreator: ({Vue, serviceManager, options, log}) => {
    return new Creator({Vue, serviceManager, options, log})
  }
}
