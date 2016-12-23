import { VueDragula, defaults as dirDefaults } from './vue-dragula'

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
export { ImmutableModelManager } from './imm-model-manager'
export { TimeMachine } from './time-machine'
export { ActionManager } from './action-manager'
export * from './vue-dragula'
export * from './service'

import { defaults as serviceDefaults } from './service'
import { defaults as commonDefaults } from './defaults'

export const defaults = {
  service: serviceDefaults,
  directive: dirDefaults,
  commonDefaults
}

if (typeof define === 'function' && define.amd) { // eslint-disable-line
  define([], () => { plugin }) // eslint-disable-line
} else if (window.Vue) {
  window.Vue.use(plugin)
}
