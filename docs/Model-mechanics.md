# Model mechanics

The `drake` event handlers have default mechanics for how to operate on the underlyng models. These can be customized as needed.

A common scenario is to have a tree of node objects, where each node has
a `children` key. You'd want to be able to drag elements to modify the node tree stucture.

```js
{
  type: 'container'
  children: [
    {
      type: 'form',
      children: [
        {
          type: 'input'
          as: 'text'
          value: 'hello'
          label: 'Your name'
        },
        {
          type: 'input'
          as: 'checkbox'
          value: 'yes'
          label: 'Feeling good?'
        }
      ]
    },
    {
      type: 'form',
      children: [
      ]
    }
  ]
}
```

In this example we should be able to move a form input specification object from one form container node to another. This is possible simply by
setting `<template>` elements with `v-dragula` directives to point to `children[0].children` and `children[1].children` respectively. We can use the rest of the node tree data to visualize the various different nodes. This could form the basis for a visual editor!

### DragHandler for fine-grained control
For fine-grained control on how nodes are added/removed from the various lists. Some lists might only allow that nodes added at the front or back, some might have validation/business rules etc.

The `dragHandler` instance of the `DragHandler` class encapsulates the states and logic of dragging and re-arranging the underlying models.

Sample code taken from `handleModels` method of `DragulaService`

```js
const dragHandler = this.createDragHandler({ ctx: this, name, drake })

drake.on('remove', dragHandler.remove)
drake.on('drag', dragHandler.drag)
drake.on('drop', dragHandler.drop)
```

Key model operation methods in `DragHandler`
- on `remove` drag action: `removeModel`
- on `drop` drag action: `dropModelSame` and `insertModel`

```js
  removeModel() {
    this.log('removeModel', {
      sourceModel: this.sourceModel,
      dragIndex: this.dragIndex
    })
    this.sourceModel.removeAt(this.dragIndex)
  }

  dropModelSame() {
    this.log('dropModelSame', {
      sourceModel: this.sourceModel,
      dragIndex: this.dragIndex,
      dropIndex: this.dropIndex
    })

    this.sourceModel.move({
      dropIndex: this.dropIndex,
      dragIndex: this.dragIndex
    })
  }

  insertModel(targetModel, dropElmModel) {
    this.log('insertModel', {
      targetModel: targetModel,
      dropElmModel: dropElmModel
    })
    targetModel.insertAt(this.dropIndex, dropElmModel)
  }
```

The `DragHandler` class can be subclassed and the model operations customized as needed. You can pass a custom factory method `createDragHandler` as a service option. Let's assume we have a `MyDragHandler` class which extends `DragHandler` and overrides key methods with custom logic. Now lets use it!

```js
function createDragHandler({ctx, name, drake}) {
  return new MyDragHandler({ ctx, name, drake })
}

export default {
  props: [],
  data() {
    return {
      //...
    }
  },
  // setup services with drakes
  created () {
    this.$dragula.createService({
      name: 'myService',
      createDragHandler,
      drakes: {
        third: true,
        fourth: {
          copy : true
        }
      }
    })
  }
}
```

Note that you can set a drake to `true` as a convenience to configure it with default options. This is a shorthand for `third: {}`. You can also pass an array of drake names, ie `drakes: ['third', 'fourth']`

### ModelManager to create and manage model

The underlying model is controlled by a `ModelManager`. By default a simple Array is used, however you can substitute and customize the `ModelManager` just like the `DragHandler` to fit your needs. You could f.ex use a history stack to enalke undo/redo and history or you an immutable list or both in combination.

```js
import { ModelManager } from 'vue2-dragula'

class MyModelManager {
  constructor(opts) {
    super(opts)
  }

  createModel() {
    return new ImmutableList()
  }

  removeAt(index) {
    //...
  }

  insertAt(index, item) {
    //...
  }

  move({dragIndex, dropIndex})
    //...
  }
}

function createModelManager(opts) {
  return new MyModelManager(opts)
}
```

Then you can pass it as the `createModelManager` option when creating a service.

```js
this.$dragula.createService({
  name: 'myService',
  createDragHandler,
  createModelManager
  // ...
})
```

The demo app now contains an example demonstrating use of a custom ModelManager, `ImmutableModelManager` with a `TimeMachine` and `ActionManager` which maintains a history of transitions and enables undo/redo of drag and drop actions!!
