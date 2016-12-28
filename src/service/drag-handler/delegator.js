import delegate from 'delegates'

export class Delegator {
  delegateFor (delName, {props = [], methods = []}) {
    if (!this[delName]) return
    this.delegateProps(delName, props)
    this.delegateMethods(delName, methods)
  }

  delegateMethods (delName, methods) {
    for (let name of methods) {
      delegate(this, delName).method(name)
    }
  }

  delegateProps (delName, methods) {
    for (let name of methods) {
      delegate(this, delName).access(name)
    }
  }
}
