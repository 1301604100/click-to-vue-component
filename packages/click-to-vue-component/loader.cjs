const { getSourceCodeLocation } = require('./dist/click-to-vue-component.cjs.cjs')

module.exports = function (source, b, c) {
  if (process.env.VUE_CLICK_TO_VUE_COMPONENT_ENABLE !== 'true' && process.env.NODE_ENV !== 'development') {
    // disable loader
    return source
  }

  const { resourcePath } = this
  try {
    const sourceCodeLocation = getSourceCodeLocation({
      source,
      filepath: resourcePath,
    })

    return sourceCodeLocation
  } catch (error) {
    console.error('[click-to-vue-component-loader] error', {
      file: resourcePath,
      error: error && error.message,
    })

    return source
  }
}
