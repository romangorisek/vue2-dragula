import { DragHandler } from './drag-handler'
import { ModelManager } from '../model/model-manager'
import { ModelHandler } from './model-handler'

export const defaults = {
  createDragHandler ({ctx, name, drake}) {
    return new DragHandler({ ctx, name, drake })
  },
  createModelManager (opts) {
    return new ModelManager(opts)
  },
  createModelHandler ({ctx, name, drake, options}) {
    return new ModelHandler({ctx, name, drake, options})
  }
}
