import dragula from 'dragula'

if (!dragula) {
  throw new Error('[vue-dragula] cannot locate dragula.')
}

import { DragHandler } from './drag-handler'

function createDragHandler({ctx, name, drake}) {
  return new DragHandler({ ctx, name, drake })
}

export class DragulaService {
  constructor (opts = {}) {
    let {name, eventBus, drakes, options } = opts
    this.log('construct DragulaService', opts)
    options  = options || {}
    this.options = options
    this.logging = options.logging
    this.name = name
    this.drakes = drakes || {} // drake store
    this.eventBus = eventBus
    this.createDragHandler = options.createDragHandler || createDragHandler

    this.events = [
      'cancel',
      'cloned',
      'drag',
      'dragend',
      'drop',
      'out',
      'over',
      'remove',
      'shadow',
      'dropModel',
      'removeModel'
    ]
  }

  log(event, ...args) {
    if (!this.logging) return
    if (!this.logging.service) return
    console.log(`DragulaService [${this.name}] :`, event, ...args)
  }

  error(msg) {
    console.error(msg)
    throw new Error(msg)
  }

  _validate(method, name) {
    if (!name) {
      this.error(`${method} must take a drake name as the first argument`)
    }
  }

  get drakeNames() {
    return Object.keys(this.drakes)
  }

  add (name, drake) {
    this.log('add (drake)', name, drake)
    this._validate('add', name)
    if (this.find(name)) {
      this.log('existing drakes', this.drakeNames)
      let errMsg = `Drake named: "${name}" already exists for this service [${this.name}]. 
      Most likely this error in cause by a race condition evaluating multiple template elements with 
      the v-dragula directive having the same drake name. Please initialise the drake in the created() life cycle hook of the VM to fix this problem.`
      this.error(msg)
    }

    this.drakes[name] = drake
    if (drake.models) {
      this.handleModels(name, drake)
    }
    if (!drake.initEvents) {
      this.setupEvents(name, drake)
    }
    return drake
  }

  find (name) {
    this.log('find (drake) by name', name)
    this._validate('find', name)
    return this.drakes[name]
  }

  handleModels (name, drake) {
    this.log('handleModels', name, drake)
    this._validate('handleModels', name)
    if (drake.registered) { // do not register events twice
      return
    }

    const dragHandler = this.createDragHandler({ ctx: this, name, drake })

    drake.on('remove', dragHandler.remove.bind(dragHandler))
    drake.on('drag', dragHandler.drag.bind(dragHandler))
    drake.on('drop', dragHandler.drop.bind(dragHandler))

    drake.registered = true
  }

  // convenience to set eventBus handlers via Object
  on (handlerConfig = {}) {
    this.log('on (events) ', handlerConfig)
    let handlerNames = Object.keys(handlerConfig)

    for (let handlerName of handlerNames) {
      let handlerFunction = handlerConfig[handlerName]
      this.log('$on', handlerName, handlerFunction)
      this.eventBus.$on(handlerName, handlerFunction)
    }
  }

  destroy (name) {
    this.log('destroy (drake) ', name)
    this._validate('destroy', name)
    let drake = this.find(name)
    if (!drake) { return }
    drake.destroy()
    this._delete(name)
  }

  _delete(name) {
    delete this.drakes[name]
  }

  setOptions (name, options) {
    this.log('setOptions (drake)', name, options)
    this._validate('setOptions', name)
    let drake = this.add(name, dragula(options))
    this.handleModels(name, drake)
    return this
  }

  setupEvents (name, drake) {
    this.log('setupEvents', name, drake)
    this._validate('setupEvents', name)
    drake.initEvents = true
    let _this = this
    let emitter = type => {
      _this.log('emitter', type)

      function replicate () {
        let args = Array.prototype.slice.call(arguments)
        let sendArgs = [name].concat(args)
        _this.log('eventBus.$emit', type, sendArgs)
        _this.eventBus.$emit(type, ...sendArgs)
      }

      drake.on(type, replicate)
    }
    this.events.forEach(emitter)
  }

  domIndexOf (child, parent) {
    return Array.prototype.indexOf.call(
      parent.children,
      child
    )
  }

  findModelForContainer (container, drake) {
    this.log('findModelForContainer', container, drake)
    return (this.findModelContainerByContainer(container, drake) || {}).model
  }

  findModelContainerByContainer (container, drake) {
    if (!drake.models) {
      return
    }
    return drake.models.find(model => model.container === container)
  }
}

