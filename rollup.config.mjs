import path from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import chalk from 'chalk'

// 插件
import typescript from '@rollup/plugin-typescript'
// import babel from '@rollup/plugin-babel'
// import externals from 'rollup-plugin-node-externals'
// import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
// import sizes from 'rollup-plugin-sizes'
import copy from 'rollup-plugin-copy'

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.')
}

const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const pkgsDir = path.resolve(__dirname, 'packages')
const pkgDir = path.resolve(pkgsDir, process.env.TARGET)

const resolve = filename => path.resolve(pkgDir, filename)

const pkg = require(resolve('package.json'))
const pkgOptions = pkg.buildOptions || {}
const name = pkgOptions.filename || path.basename(pkgDir)

const outputConfigs = {
  esm: {
    banner: '#!/usr/bin/env node',
    file: resolve(`dist/${name}.esm.js`),
    format: 'es',
  },
  cjs: {
    banner: '#!/usr/bin/env node',
    file: resolve(`dist/${name}.cjs.cjs`),
    format: `cjs`,
  },
  umd: {
    file: resolve(`dist/${name}.umd.js`),
    format: `umd`,
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife',
  },
}

const defaultFormats = ['esm', 'cjs']
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')
const packageFormats = inlineFormats || pkgOptions.formats || defaultFormats
const packageConfigs = process.env.PROD_ONLY
  ? []
  : pkgOptions.formats
    ? packageFormats.map(format => createConfig(format, outputConfigs[format]))
    : pkgOptions.multiples.map(options => createCustomConfig(options))

function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(chalk.yellow(`invalid format: ${format}`))
    process.exit(1)
  }

  const entryFile = pkgOptions.entry || 'src/index.ts'

  const tsPlugin = typescript({
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
  })

  return {
    input: resolve(entryFile),
    output,
    plugins: [
      ...plugins,
      tsPlugin,
      commonjs(),
      copy({
        targets: [{ src: `./packages/${name}/src/templates/*`, dest: `./packages/${name}/dist/templates` }],
      }),
      json(),
    ],
  }
}

function createCustomConfig(options, plugins = []) {
  const input = options.input
  const output = options.output.map(outputOption => {
    outputOption.file = resolve(outputOption.file)
    return outputOption
  })

  const tsPlugin = typescript({
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
  })

  return {
    input: resolve(input),
    output,
    plugins: [
      ...plugins,
      tsPlugin,
      commonjs(),
      copy({
        targets: [{ src: `./packages/${name}/src/templates/*`, dest: `./packages/${name}/dist/templates` }],
      }),
      json(),
    ],
  }
}

export default packageConfigs
