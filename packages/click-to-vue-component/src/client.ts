import { datasetName, hoverClassName, hoverStyle } from './config'

if (process.env.NODE_ENV === 'development') {
  document.head.insertAdjacentHTML('beforeend', hoverStyle)
  const _datasetName = datasetName.replaceAll(/(-\w)/g, $1 => {
    return $1.replace('-', '').toUpperCase()
  })

  function clearStyle() {
    document.querySelectorAll(`[${hoverClassName}]`).forEach(el => {
      el.removeAttribute(hoverClassName)
    })
  }

  function setStyle(el: HTMLElement | null) {
    const _el = getElWithSourceCodeLocation(el)
    _el?.setAttribute(hoverClassName, '')
  }

  function getElWithSourceCodeLocation(el: HTMLElement | null) {
    while (el && !el.dataset?.[_datasetName]) {
      el = el.parentElement
    }
    return el
  }

  function openSourceCode(sourceCodeLocation: string) {
    let url = `vscode://file/${sourceCodeLocation}`
    if (sourceCodeLocation.startsWith('/')) {
      url = `vscode://file${sourceCodeLocation}`
    }
    window.open(url)
  }

  window.addEventListener('click', e => {
    if (!e.altKey || e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    const el = getElWithSourceCodeLocation(e.target as HTMLElement)
    const sourceCodeLocation = el?.dataset?.[_datasetName]
    if (!sourceCodeLocation) return
    openSourceCode(sourceCodeLocation)
  })

  window.addEventListener('mousemove', e => {
    clearStyle()
    if (!e.altKey) return
    setStyle(e.target as HTMLElement)
  })

  window.addEventListener('keyup', e => {
    if (e.key !== 'Alt') return
    clearStyle()
  })
}
