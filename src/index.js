import VueDragula from './vue-dragula'

function plugin (Vue, options = {}) {
  if (plugin.installed) {
    console.warn('[vue2-dragula] already installed.')
  }

  console.log('Add Dragula plugin:', options)
  VueDragula(Vue, options)
}

plugin.version = '3.0.0'

export const Vue2Dragula = plugin

// make it possible to subclass service and drag handler
export { DragulaService } from './service'
export { DragHandler } from './drag-handler'
export { ModelManager } from './model-manager'
export { ImmutableModelManager } from './imm-model-manager'
export { TimeMachine } from './time-machine'
export { ActionManager } from './action-manager'

import * as directive from './vue-dragula/directive'
export { directive }

export { defaults } from './vue-dragula/defaults'
export { Dragula } from './vue-dragula/dragula'
export { Logger } from './vue-dragula/logger'
export { ServiceManager } from './vue-dragula/service-manager'

if (typeof define === 'function' && define.amd) { // eslint-disable-line
  define([], () => { plugin }) // eslint-disable-line
} else if (window.Vue) {
  window.Vue.use(plugin)
}
