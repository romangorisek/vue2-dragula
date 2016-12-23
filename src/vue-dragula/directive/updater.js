import { Base } from './base'

export class Updater extends Base {
  constructor ({serviceManager, name, log}) {
    super({serviceManager, name, log})
    this.drakeContainers = {}
    this.execute = this.update.bind(this)
  }

  update ({newValue, container, vnode, ctx}) {
    this.log('updateDirective')
    const { service, drake, drakeName, serviceName } = super.extractAll({vnode, ctx})

    this.drakeContainers[drakeName] = this.drakeContainers[drakeName] || []
    let drakeContainer = this.drakeContainers[drakeName]

    if (!drake.models) {
      drake.models = []
    }

    if (!vnode) {
      container = this.el // Vue 1
    }

    let modelContainer = service.findModelContainer(container, drake)

    drakeContainer.push(container)

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
