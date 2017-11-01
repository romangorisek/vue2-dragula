# Drake mechanics and customization

- How drakes work
- Drake configuration

## How drakes work

In the directive `bind` function we have the following core logic:

```js
  if (drake) {
    drake.containers.push(container)
    return
  }
  drake = dragula({
    containers: [container]
  })
  service.add(name, drake)
```

If the drake already exists, ie. `if (drake) { ... }` then we add the container directly into a pre-existing drake created in the `created` lifecycle hook of the component. Otherwise it tries to register as a new named drake in the service `drakes` map (Object).

### Drake conflict warning

You can get a conflict if one or more drakes are added via directives, and the drakes have not been pre-configured in the VM. This conflict is caused by race conditions, as the directives are evaluated asynchronously for enhanced view performance!

Thanks to [@Astray-git](https://github.com/Astray-git) for [making this clear](https://github.com/Astray-git/vue-dragula/issues/12#issuecomment-260134897)

Note: *@Astray-git* is the original author of this plugin :)

Note: In the near future we will likely try to overcome this constraint, by always inserting the new container in an existing drake or simply overwriting.

Setup a service with one or more drakes ready for drag'n drop action

```js
created () {
  this.$dragula.createService({
    name: 'myService',
    drakes: {
      'first': {
        copy: true
      }
    }
  }).on({
    // ... event handler map
  })
}
```

You can also use the `drakesFor` method on a registered service.

```js
this.$dragula.drakesFor('myService', {
  'first': {
    copy: true
  }
})
```

This ensures that the `DragulaService` instance `myService` is registered and contains one or more drakes which are ready to be populated by `v-dragula` container elements.

```html
<div class="wrapper">
  <div class="container" v-dragula="colOne" service="myService" drake="first">
    <!-- with click -->
    <div v-for="text in colOne" @click="onClick">{{text}} [click me]</div>
  </div>
  <div class="container" v-dragula="colTwo" service="myService" drake="first">
    <div v-for="text in colTwo">{{text}}</div>
  </div>
</div>
```

If you simply specify the service name without a specific named drake configuration it will use the `default` drake. A named service will always have a `default` drake configuration.

```html
  <div class="container" v-dragula="colTwo" service="myService">
    <div v-for="text in colTwo">{{text}}</div>
  </div>
```

You can configure the `default` drake simply using the `drake` option on the service.

```js
this.$dragula.createService({
  name: 'myService',
  drake: {
  }
})
```

When the `v-dragula` directives are evaluated and bound to the component (via directive `bind` method), they will each find a drake configuration of that name on the service and push their DOM `container` to the list of `drake.containers`.

```js
if (drake) {
  drake.containers.push(container)
  return
}
```

### Drake configuration

If you need to add [dragula containers and models](https://github.com/bevacqua/dragula#dragulacontainers-options) programmatically, try something like this:

```js
drake.models.push({
  model: model,
  container: container
})
```

Here the `model` is a pointer to a list in the model data of your VM. The container is a DOM element which contains a list of elements that an be dragged and rearranged and their ordering reflected (mirrored) in the model.

To access and modify models and containers for a particular drake:

```js
const drake = this.$dragula.service('my-list').find('third')
drake.models.push({
  model: model,
  container: container
})
drake.containers.push(container)
```

You will need a good understanding of the inner workings of Dragula in order to get this right ;) Feel free to help improve the API to make this easier!
