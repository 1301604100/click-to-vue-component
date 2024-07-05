#!/usr/bin/env node
'use strict';

const datasetName = '__source-code-location';
const hoverClassName = 'data-__click-to-component-hover';
const hoverStyle = `
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
`;

if (process.env.NODE_ENV === 'development') {
    document.head.insertAdjacentHTML('beforeend', hoverStyle);
    const _datasetName = datasetName.replaceAll(/(-\w)/g, $1 => {
        return $1.replace('-', '').toUpperCase();
    });
    function clearStyle() {
        document.querySelectorAll(`[${hoverClassName}]`).forEach(el => {
            el.removeAttribute(hoverClassName);
        });
    }
    function setStyle(el) {
        const _el = getElWithSourceCodeLocation(el);
        _el === null || _el === void 0 ? void 0 : _el.setAttribute(hoverClassName, '');
    }
    function getElWithSourceCodeLocation(el) {
        var _a;
        while (el && !((_a = el.dataset) === null || _a === void 0 ? void 0 : _a[_datasetName])) {
            el = el.parentElement;
        }
        return el;
    }
    function openSourceCode(sourceCodeLocation) {
        let url = `vscode://file/${sourceCodeLocation}`;
        if (sourceCodeLocation.startsWith('/')) {
            url = `vscode://file${sourceCodeLocation}`;
        }
        window.open(url);
    }
    window.addEventListener('click', e => {
        var _a;
        if (!e.altKey || e.button !== 0)
            return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const el = getElWithSourceCodeLocation(e.target);
        const sourceCodeLocation = (_a = el === null || el === void 0 ? void 0 : el.dataset) === null || _a === void 0 ? void 0 : _a[_datasetName];
        if (!sourceCodeLocation)
            return;
        openSourceCode(sourceCodeLocation);
    });
    window.addEventListener('mousemove', e => {
        clearStyle();
        if (!e.altKey)
            return;
        setStyle(e.target);
    });
    window.addEventListener('keyup', e => {
        if (e.key !== 'Alt')
            return;
        clearStyle();
    });
}
