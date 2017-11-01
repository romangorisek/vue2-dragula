# Time travel

The following classes are included:

- `ImmutableModelManager`
- `TimeMachine`
- `ActionManager`

See [time travel demo](https://github.com/kristianmandrup/vue2-dragula-demo/) for how to use these classes.

```js
import {
  ImmutableModelManager,
  TimeMachine, ActionManager
} from 'vue2-dragula'
```

The ImmutableModelManager should normally be subclassed, especially `createModel` which returns a normal `Array`

```js
  createModel (model) {
    return model || []
  }
```

Instead wrap the created model in an immutable of your choice, such as [seamless-immutable](https://www.npmjs.com/package/seamless-immutable) used in the demo.

```js
class SeamlessImmutableModelManager extends ImmutableModelManager {
  constructor(opts) {
    super(opts)
  }

  createModel (model) {
    return Immutable(model || [])
  }
}
```

Note that you can pass a `createTimeMachine` factory method as an option in `opts`, otherwise the default time machine is used.

```js
const createDefaultTimeMachine = function (opts) {
  return new TimeMachine(opts)
}
```

The `ActionManager` can be used to manage actions at the VM level. If you have multiple draggable containers, register an ActionManager for each in a registry of sorts.
