import { DragHandler } from './drag-handler'
import { ModelManager } from './model-manager'

export const defaults = {
  createDragHandler ({ctx, name, drake}) {
    return new DragHandler({ ctx, name, drake })
  },
  createModelManager (opts) {
    return new ModelManager(opts)
  }
}
