import { Base } from './base'
import dragula from 'dragula'

export class Binder extends Base {
  constructor ({serviceManager, name, log}) {
    super({serviceManager, name, log})
    this.execute = this['bind'].bind(this)
  }

  bind ({container, vnode, ctx}) {
    const { service, drake, name, drakeName, serviceName } = super.extractAll({vnode, ctx})

    if (!vnode) {
      container = this.el // Vue 1
    }

    this.log({
      service: {
        name: serviceName,
        instance: service
      },
      drake: {
        name: drakeName,
        instance: drake
      },
      container
    })

    if (drake) {
      drake.containers.push(container)
      return
    }
    let newDrake = dragula({
      containers: [container]
    })
    service.add(name, newDrake)

    service.handleModels(name, newDrake)
  }
}
