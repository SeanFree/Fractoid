import { reactive } from 'vue'

export type VisibilityData = string | number | object

export default (moduleName: string) => () => {
  const model = reactive<{
    [name: string]: {
      visible: boolean
      data?: VisibilityData
      onCancel?: () => unknown
      onConfirm?: () => unknown
      onClose?: () => {}
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

  const setData = (name: string, data: string | number | object) => {
    if (isRegistered(name)) {
      model[name].data = data
    }
  }

  const getData = (name: string) => {
    if (isRegistered(name)) {
      return model[name].data
    }
  }

  const clearData = (name: string) => {
    if (isRegistered(name)) {
      model[name].data = undefined
    }
  }

  const hide = (name: string, clear = false) => {
    if (isRegistered(name)) {
      model[name].visible = false

      if (clear) {
        clearData(name)
      }
    }
  }

  const hideAll = () => {
    for (const name in model) {
      model[name].visible = false
    }
  }

  const show = (name: string, data?: VisibilityData) => {
    if (isRegistered(name)) {
      hideAll()

      model[name].visible = true

      if (data) {
        setData(name, data)
      }
    }
  }

  const getVisibility = (name: string) => model[name]?.visible || false

  const setVisibility = (name: string, visible: boolean) => {
    if (isRegistered(name)) {
      model[name].visible = visible
    }
  }

  const toggleVisibility = (name: string) => {
    if (isRegistered(name)) {
      hideAll()

      model[name].visible = !model[name].visible
    }
  }

  return {
    add,
    remove,
    setData,
    getData,
    clearData,
    show,
    hide,
    hideAll,
    getVisibility,
    setVisibility,
    toggleVisibility,
  }
}
