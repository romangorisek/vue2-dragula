import dragula from 'dragula'

if (!dragula) {
  throw new Error('[vue-dragula] cannot locate dragula.')
}

import { defaults } from './defaults'

export * from './directive'
export { defaults }
export { Dragula } from './dragula'
export { Logger } from './logger'
export { ServiceManager } from './service-manager'

export function VueDragula (Vue, options = {}) {
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
  console.log('Created global $dragula')

  Vue.prototype.$dragula = Vue.$dragula

  const customFacFun = options.directive ? options.directive.createCreator : null
  const creatorFactory = customFacFun || defaults.createCreator
  console.log('create main factory')
  const creator = creatorFactory({Vue, serviceManager, options, log})
  console.log('EXECUTE')
  creator.execute()
  console.log('READY')
}
