import dragula from 'dragula'

if (!dragula) {
  throw new Error('[vue-dragula] cannot locate dragula.')
}

import Logger from './logger'
import Dragula from './dragula'
import ServiceManager from './service-manager'
import { Creator } from './directive'

export default function (Vue, options = {}) {
  // set full fine-grained logging if true
  if (options.logging === true) {
    options.logging = {
      plugin: true,
      directive: true,
      service: true,
      dragHandler: true
    }
  }
  const log = new Logger(options)
  log.plugin('Initializing vue-dragula plugin', options)

  const serviceManager = new ServiceManager({Vue, options, log})

  Vue.$dragula = new Dragula({serviceManager, log})

  Vue.prototype.$dragula = Vue.$dragula

  const creator = new Creator({Vue, serviceManager, options, log})
  creator.create()
}
