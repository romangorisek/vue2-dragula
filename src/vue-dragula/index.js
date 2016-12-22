import dragula from 'dragula'

if (!dragula) {
  throw new Error('[vue-dragula] cannot locate dragula.')
}

import { defaults } from './defaults'

export default function (Vue, options = {}) {
  // set full fine-grained logging if true
  if (options.logging === true) {
    options.logging = options.defaultLogsOn || {
      plugin: true,
      directive: true,
      service: true,
      dragHandler: true,
      modelManager: true
    }
  }
  const logFactory = options.createLogger || defaults.createLogger
  const log = logFactory(options)
  log.plugin('Init: vue-dragula plugin', options)

  const serviceManagerFactory = options.createServiceManager || defaults.createServiceManager
  const serviceManager = serviceManagerFactory({Vue, options, log})

  const dragulaFactory = options.createDragula || defaults.createDragula
  Vue.$dragula = dragulaFactory({serviceManager, log})

  Vue.prototype.$dragula = Vue.$dragula

  const creatorFactory = options.createDirectiveCreator || defaults.createDirectiveCreator
  const creator = creatorFactory({Vue, serviceManager, options, log})
  creator.execute()
}
