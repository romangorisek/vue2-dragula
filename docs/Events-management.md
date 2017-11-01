# Dragula events and drag effects

To "fine tune" Dragula events and drag effects:

- [events](https://github.com/kristianmandrup/vue2-dragula#events)
- [$dragula API](https://github.com/kristianmandrup/vue2-dragula#dragula)
- [drag effects & events](https://github.com/kristianmandrup/vue2-dragula#adding-drag-effects)

Events supported can be found (and modified) in the `DragulaService` instance, `events` instance variable:

```js
let supportedEvents = myDragulaService.events
myDragulaService.addEvents('accepts', 'moves')
myDragulaService.removeEvents('out', 'over')
```

The `events` instance variable os used in `setupEvents(name, drake)` which you can override to customize event handling and emits as needed.

If you subclass `DragulaService` (recommended), you can override `calcOpts` to calculate event options for additional events:

```js
calcOpts(name, args) {
  let argEventMap = this.argsEventMap[name]
  return argEventMap ? argEventMap(args) : argEventMap.defaultEvent(args)
}
```

You can use `set argsEventMap(customArgsEventMap)` to add custom arg -> event conversion for any additional events, usin `get defaultArgsEventMap()` as
a baseline.

Currently the following [Dragula events](https://github.com/bevacqua/dragula#drakeon-events) are directly supported:

- `cloned`
- `moves`
- `accepts`
- `invalid`
- `drag`
- `dragend`
- `drop`
- `copy`

Any other event is expected to be handled by the default case, ie. `(el, container, source)`
