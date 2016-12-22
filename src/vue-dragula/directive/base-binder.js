import { calcNames } from './utils'

export default class BaseBinder {
  constructor ({serviceManager, name, log}) {
    this.serviceManager = serviceManager
    this.globalName = name
    this.log = log.dir
  }

  extractAll ({container, vnode}) {
    const { name, drakeName, serviceName } = calcNames(this.globalName, vnode, this)
    const service = this.serviceManager.findService(name, vnode, serviceName)
    const drake = service.find(drakeName, vnode)

    return { drake, service, name, drakeName, serviceName }
  }
}
