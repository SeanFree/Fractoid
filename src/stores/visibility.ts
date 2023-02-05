import { reactive } from 'vue'

export default (moduleName: string) => () => {
  const model = reactive<{
    [name: string]: {
      visible: boolean
    }
  }>({})
  const isRegistered = (name: string) => {
    if (name in model) {
      return true
    } else {
      console.warn(`Visibility.${moduleName} Invalid name - ${name}`)

      return false
    }
  }

  const add = (id: string, defaultVisible = false) => {
    model[id] = {
      visible: defaultVisible,
    }
  }
  const remove = (name: string) => {
    if (isRegistered(name)) {
      delete model[name]
    }
  }
  const show = (name: string) => {
    if (isRegistered(name)) {
      model[name].visible = true
    }
  }
  const hide = (name: string) => {
    if (isRegistered(name)) {
      model[name].visible = false
    }
  }
  const getVisibility = (name: string) => model[name]?.visible || false

  const setVisibility = (name: string, visible: boolean) => {
    if (isRegistered(name)) {
      model[name].visible = visible
    }
  }

  return {
    add,
    remove,
    show,
    hide,
    getVisibility,
    setVisibility,
  }
}
