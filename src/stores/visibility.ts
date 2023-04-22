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
  const hooks = reactive<{
    [name: string]: {
      hide: Function[]
      show: Function[]
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

  const add = (name: string, defaultVisible = false) => {
    model[name] = {
      visible: defaultVisible,
    }

    hooks[name] = {
      hide: [],
      show: [],
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

      if (hooks[name].hide.length) {
        for (const hook of hooks[name].hide) {
          hook()
        }
      }
    }
  }

  const hideAll = () => {
    for (const name in model) {
      hide(name, true)
    }
  }

  const onHide = (name: string, handler: Function | Function[]) => {
    hooks[name].hide = (hooks[name].hide || []).concat(handler)
  }

  const onShow = (name: string, handler: Function | Function[]) => {
    hooks[name].show = (hooks[name].show || []).concat(handler)
  }

  const show = (name: string, data?: VisibilityData) => {
    if (isRegistered(name)) {
      hideAll()

      model[name].visible = true

      if (data) {
        setData(name, data)
      }

      if (hooks[name].show.length) {
        for (const hook of hooks[name].show) {
          hook()
        }
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
      if (model[name].visible) {
        hide(name)
      } else {
        hideAll()
        show(name)
      }
    }
  }

  return {
    add,
    remove,
    setData,
    getData,
    clearData,
    onHide,
    onShow,
    show,
    hide,
    hideAll,
    getVisibility,
    setVisibility,
    toggleVisibility,
  }
}
