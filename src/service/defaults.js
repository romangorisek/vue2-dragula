import { ModelManager } from '../model/model-manager'
import { DragHandler, ModelHandler, DragulaEventHandler } from './drag-handler'

export const defaults = {
  createDragHandler ({service, name, drake}) {
    return new DragHandler({ service, name, drake })
  },
  createModelHandler ({dh, service, options}) {
    return new ModelHandler({service, dh, options})
  },
  createDragulaEventHandler ({dh, service, options}) {
    return new DragulaEventHandler({service, dh, options})
  },
  createModelManager (opts) {
    return new ModelManager(opts)
  }
}
