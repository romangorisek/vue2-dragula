import { calcNames } from './utils'

export class Updater {
  constructor ({serviceManager, name, log}) {
    this.log = log.dir
    this.globalName = name
    this.drakeContainers = {}
    this.serviceManager = serviceManager
    this.execute = this.update.bind(this)
  }

  update ({newValue, container, vnode, ctx}) {
    this.newValue = newValue
    this.container = container
    this.vnode = vnode

    this.log('updateDirective')

    const { name, drakeName, serviceName } = calcNames(this.globalName, vnode, ctx)
    const service = this.serviceManager.findService(name, vnode, serviceName)
    const drake = service.find(drakeName, vnode)

    this.drakeContainers[drakeName] = this.drakeContainers[drakeName] || []
    let dc = this.drakeContainers[drakeName]

    if (!service) {
      this.log('no service found', name, drakeName)
      return
    }

    if (!drake.models) {
      drake.models = []
    }

    if (!vnode) {
      container = this.el // Vue 1
    }

    let modelContainer = service.findModelContainerByContainer(container, drake)

    dc.push(container)

    this.log('DATA', {
      service: {
        name: serviceName,
        instance: service
      },
      drake: {
        name: drakeName,
        instance: drake
      },
      container,
      modelContainer
    })

    if (modelContainer) {
      this.log('set model of container', newValue)
      modelContainer.model = newValue
    } else {
      this.log('push model and container on drake', newValue, container)
      drake.models.push({
        model: newValue,
        container: container
      })
    }
  }
}
