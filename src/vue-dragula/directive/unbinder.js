import BaseBinder from './base-binder'

export default class UnBinder extends BaseBinder {
  constructor ({serviceManager, name, log}) {
    super({serviceManager, name, log})
    this.execute = this.unbind.bind(this)
  }

  unbind ({container, binding, vnode}) {
    const { service, drake, name, drakeName, serviceName } = super.extractAll(vnode)

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

    if (!drake) { return }

    var containerIndex = drake.containers.indexOf(container)

    if (containerIndex > -1) {
      this.log('remove container', containerIndex)
      drake.containers.splice(containerIndex, 1)
    }

    if (drake.containers.length === 0) {
      this.log('destroy service')
      service.destroy(name)
    }
  }
}

