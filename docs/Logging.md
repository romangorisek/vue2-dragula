# Logging configuration

You can pass a `logging: true` as an option when initialising the plugin or when you create a new service.

```js
Vue.use(VueDragula, {
  // ...
  logging: true
});
```

*Fine grained logging*

You can also specify more fine grained logging as follows:

```js
Vue.use(VueDragula, {
  // ...
  logging: {
    service: true,
    dragHandler: true
  }
});
```

The logging options are: `plugin`, `directive`, `service` and `dragHandler`

Logging is essential in development mode!!
