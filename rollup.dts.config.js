// @ts-check
import { parse } from '@babel/parser'
import { existsSync, readdirSync, readFileSync } from 'fs'
import MagicString from 'magic-string'
import dts from 'rollup-plugin-dts'
import { walk } from 'estree-walker'

if (!existsSync('temp/packages')) {
  console.warn('no temp dts files found. run `tsc -p tsconfig.build.json` first.')
  process.exit(1)
}

export default readdirSync('temp/packages').map(pkg => {
  return {
    input: `./temp/packages/${pkg}/src/index.d.ts`,
    output: {
      file: `packages/${pkg}/dist/${pkg}.d.ts`,
      format: 'es',
    },
    plugins: [dts()],
    onwarn(warning, warn) {
      // during dts rollup, everything is externalized by default
      if (warning.code === 'UNRESOLVED_IMPORT' && !warning.exporter.startsWith('.')) {
        return
      }
      warn(warning)
    },
  }
})
