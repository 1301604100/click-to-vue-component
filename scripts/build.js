import { createRequire } from 'module'
import fs from 'fs-extra'
import path from 'path'
import minimist from 'minimist'
import chalk from 'chalk'
import ora from 'ora'
import { execa } from 'execa'
import { promisify } from 'util'

const require = createRequire(import.meta.url)

const args = minimist(process.argv.slice(2))
const formats = args.formats || args.f
const packageName = args.package || args.p
const BUILD_ALL_FLAG = 'all'

const packages = fs.readdirSync('packages')

if (!packageName || !packages.includes(packageName)) {
  console.log(chalk.red(`包名:${packageName} 不合法，请按照参考 packages 文件夹下的目录名。`, `可输入包名:${BUILD_ALL_FLAG} 构建所有包`))
  process.exit(1)
}

const targets = packages.filter(folder => {
  if (!fs.statSync(`packages/${folder}`).isDirectory()) {
    return false
  }
  const pkg = require(`../packages/${folder}/package.json`)
  // 去除私有包和没有构建配置的
  if (pkg.private && !pkg.buildOptions) {
    return false
  }
  if (packageName === BUILD_ALL_FLAG) {
    return true
  }

  if (packageName === folder) {
    return true
  }
  return false
})

// 执行打包
run()

async function run() {
  buildAll(targets)
}

async function buildAll(targets) {
  const spinner = ora(`building...`).start()
  const buildResult = await runParallel(require('os').cpus().length, targets, build)
  spinner.info('build result as:')
  console.table(buildResult)
}

async function runParallel(maxConcurrency, source, iteratorFn) {
  const ret = []
  const executing = []
  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item, source))
    ret.push(p)

    if (maxConcurrency <= source.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1))
      executing.push(e)
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}

async function build(target) {
  // const pkgDir = path.resolve(`packages/${target}`)
  // const pkg = require(`${pkgDir}/package.json`)
  await removeDist(target)
  const res = await execa('rollup', ['-c', '--environment', [formats ? `FORMATS:${formats}` : ``, `TARGET:${target}`].filter(Boolean).join(',')])
  return { name: target, result: res.exitCode === 0 ? 'success' : 'fail' }
}

async function removeDist(target) {
  return await promisify(fs.remove)(`packages/${target}/dist`)
}
