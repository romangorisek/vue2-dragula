export function isEmpty (str) {
  if (!str) return true
  if (str.length === 0) return true
  return false
}

export function calcNames (name, vnode, ctx) {
  let drakeName = vnode
    ? vnode.data.attrs.drake // Vue 2
    : this.params.drake // Vue 1

  const serviceName = vnode
    ? vnode.data.attrs.service // Vue 2
    : this.params.service // Vue 1

  if (drakeName !== undefined && drakeName.length !== 0) {
    name = drakeName
  }
  drakeName = isEmpty(drakeName) ? 'default' : drakeName

  return {name, drakeName, serviceName}
}
