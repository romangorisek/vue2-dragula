# Adding Drag Effects

Please see and try out the `DragEffects` example of the [demo app](https://github.com/kristianmandrup/vue2-dragula-demo/)

Also check out [dragula drakeon events](https://github.com/bevacqua/dragula#drakeon-events)

```js
// https://developer.mozilla.org/en/docs/Web/API/Element/classList
service.on({
  accepts: ({name, el, target}) => {
    return true
  },
  drag: ({el, container, service, drake}) => {
    el.classList.remove('ex-moved')
  },
  drop: ({el, container}) => {
    el.classList.add('ex-moved')
  },
  over: ({el, container}) => {
    el.classList.add('ex-over')
  },
  out: ({el, container}) => {
    el.classList.remove('ex-over')
  }
})
```

Here `name` is the drake name and `drake`  and `server` are the drake and service instances (objects).

You can also subscribe to service specific events, here for `drag` events from the service called `my-first`

```js
  'my-first:drag': ({el, container}) => {
    el.classList.remove('ex-moved')
  },
```

Sample effect styling with [CSS fade-in transition effect](http://www.chrisbuttery.com/articles/fade-in-fade-out-with-javascript/)

```css
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.ex-moved {
  animation: fadeIn .5s ease-in 1 forwards;
  border: 2px solid yellow;
  padding: 2px
}

.ex-over {
  animation: fadeIn .5s ease-in 1 forwards;
  border: 4px solid green;
  padding: 2px
}
```
