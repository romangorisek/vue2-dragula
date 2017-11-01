# Customization

- Custom DragulaService
- Custom event bus

## Custom DragulaService

You can also subclass `DragulaService` or create your own, then pass a `createService` option for you install the plugin:

```js
import { DragulaService } from 'vue2-dragula'

class MyDragulaService extends DragulaService {
  /// ...
}

function createService({name, eventBus, drakes}) {
  return new MyDragulaService({
    name,
    eventBus,
    drakes
  })
}

Vue.use(VueDragula, { createService });
```

## Custom event bus
You can customize the event bus used via the `createEventBus` option.
You could f.ex create an event bus factory method to always log events emitted if logging is turned on.

```js
function createEventBus(Vue, options = {}) {
  const eventBus = new Vue()
  return {
    $emit: function(event, args) {
      if (options.logging) {
        console.log('emit:', event, args)
      }
      eventBus.$emit(event, args)
    }
  })
}

Vue.use(VueDragula, { createEventBus });
```
