import htmlTags from 'html-tags'
import { parseFragment } from 'parse5'
import { datasetName } from './config'

export default function getSourceCodeLocation(options: { source: string; filepath: string }) {
  const { source, filepath } = options
  const ast = parseFragment(source, { sourceCodeLocationInfo: true })

  let nodes = ast?.childNodes ? ast?.childNodes : []
  let index = 0
  while (nodes.length > index) {
    nodes = nodes.concat(nodes[index]?.childNodes || [], nodes[index]?.content?.childNodes || [])
    index++
  }

  const startOffsetSet = new Set()
  const sortNodes = nodes
    .filter(node => {
      const { startOffset } = node?.sourceCodeLocation || {}
      if (!startOffset) return false

      if (startOffsetSet.has(startOffset)) return false
      startOffsetSet.add(startOffset)

      if (!htmlTags.includes(node?.nodeName)) return false
      return true
    })
    .sort((a, b) => b.sourceCodeLocation!.startOffset - a.sourceCodeLocation!.startOffset)

  let result = source
  sortNodes.forEach(node => {
    const { startOffset, startLine, startCol } = node.sourceCodeLocation!
    const sourceCodeLocation = ` data-${datasetName}="${filepath}:${startLine}:${startCol}" `
    const insertPos = startOffset + node.nodeName.length + 1
    result = result.substring(0, insertPos) + sourceCodeLocation + result.substring(insertPos)
  })

  return result
}
