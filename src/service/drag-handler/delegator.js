import delegate from 'delegates'

export class Delegator {
  delegateFor (delName, {props = [], methods = []}) {
    console.log('delegateFor', delName, props, methods)
    if (!this[delName]) {
      console.log('skip delegation, no delegation obj', this[delName])
      return
    }
    this.delegateProps(delName, props)
    this.delegateMethods(delName, methods)
  }

  delegateMethods (delName, methods) {
    for (let name of methods) {
      delegate(this, delName).method(name)
    }
  }

  delegateProps (delName, props) {
    console.log('delegateProps access', props)
    for (let name of props) {
      delegate(this, delName).access(name)
    }
  }
}
