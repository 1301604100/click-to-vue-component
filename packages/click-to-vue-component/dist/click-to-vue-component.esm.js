#!/usr/bin/env node
import htmlTags from 'html-tags';
import { parseFragment } from 'parse5';

const datasetName = '__source-code-location';

function getSourceCodeLocation(options) {
    var _a, _b, _c;
    const { source, filepath } = options;
    const ast = parseFragment(source, { sourceCodeLocationInfo: true });
    let nodes = (ast === null || ast === void 0 ? void 0 : ast.childNodes) ? ast === null || ast === void 0 ? void 0 : ast.childNodes : [];
    let index = 0;
    while (nodes.length > index) {
        nodes = nodes.concat(((_a = nodes[index]) === null || _a === void 0 ? void 0 : _a.childNodes) || [], ((_c = (_b = nodes[index]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.childNodes) || []);
        index++;
    }
    const startOffsetSet = new Set();
    const sortNodes = nodes
        .filter(node => {
        const { startOffset } = (node === null || node === void 0 ? void 0 : node.sourceCodeLocation) || {};
        if (!startOffset)
            return false;
        if (startOffsetSet.has(startOffset))
            return false;
        startOffsetSet.add(startOffset);
        if (!htmlTags.includes(node === null || node === void 0 ? void 0 : node.nodeName))
            return false;
        return true;
    })
        .sort((a, b) => b.sourceCodeLocation.startOffset - a.sourceCodeLocation.startOffset);
    let result = source;
    sortNodes.forEach(node => {
        const { startOffset, startLine, startCol } = node.sourceCodeLocation;
        const sourceCodeLocation = ` data-${datasetName}="${filepath}:${startLine}:${startCol}" `;
        const insertPos = startOffset + node.nodeName.length + 1;
        result = result.substring(0, insertPos) + sourceCodeLocation + result.substring(insertPos);
    });
    return result;
}

export { getSourceCodeLocation };
