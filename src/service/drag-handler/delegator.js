import delegate from 'delegates'

export class Delegator {
  delegateFor (del, {props = [], methods = []}) {
    this.delegateProps(del, props)
    this.delegateMethods(del, methods)
  }

  delegateMethods (del, methods) {
    for (let name of methods) {
      delegate(this, 'dh').method(name)
    }
  }

  delegateProps (del, methods) {
    for (let name of methods) {
      delegate(this, 'dh').access(name)
    }
  }
}
