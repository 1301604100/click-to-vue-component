export const datasetName = '__source-code-location'
export const hoverClassName = 'data-__click-to-component-hover'
export const hoverStyle = `
<style type="text/css" key="click-to-component-style">
  [data-click-to-component] * {
    pointer-events: auto !important;
  }

  [${hoverClassName}] {
    cursor: var(--click-to-component-cursor, context-menu) !important;
    outline: auto 1px;
    outline: var(
      --click-to-component-outline,
      -webkit-focus-ring-color auto 1px
    ) !important;
  }
</style>
`
