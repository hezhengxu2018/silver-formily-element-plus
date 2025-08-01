import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { camelize } from 'vue'

type Append = Record<'headers' | 'footers' | 'scriptSetups', string[]>

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projRoot = path.resolve(__dirname, '..', '..', '..')
const docsDirName = 'docs'
const docRoot = path.resolve(projRoot, docsDirName)
export function MarkdownTransform(): Plugin {
  return {
    name: 'element-plus-md-transform',

    enforce: 'pre',

    async transform(code, id) {
      if (!id.endsWith('.md'))
        return
      const componentId = path.basename(id, '.md')
      const append: Append = {
        headers: [],
        footers: [],
        scriptSetups: getExampleImports(componentId),
      }

      code = transformVpScriptSetup(code, append)

      return combineMarkdown(
        code,
        [combineScriptSetup(append.scriptSetups), ...append.headers],
        append.footers,
      )
    },
  }
}

function combineScriptSetup(codes: string[]) {
  return `\n<script setup>
${codes.join('\n')}
</script>
`
}

function combineMarkdown(code: string, headers: string[], footers: string[]) {
  const frontmatterEnds = code.indexOf('---\n\n')
  const firstHeader = code.search(/\n#{1,6}\s.+/)
  const sliceIndex
    = firstHeader < 0
      ? (frontmatterEnds === -1
          ? 0
          : frontmatterEnds + 4)
      : firstHeader

  if (headers.length > 0) {
    code
      = code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex)
  }
  code += footers.join('\n')

  return `${code}\n`
}

// eslint-disable-next-line regexp/no-super-linear-backtracking
const vpScriptSetupRE = /<vp-script\s(.*\s)?setup(\s.*)?>([\s\S]*)<\/vp-script>/

function transformVpScriptSetup(code: string, append: Append) {
  const matches = code.match(vpScriptSetupRE)
  if (matches)
    code = code.replace(matches[0], '')
  const scriptSetup = matches?.[3] ?? ''
  if (scriptSetup)
    append.scriptSetups.push(scriptSetup)
  return code
}

function getExampleImports(componentId: string) {
  const examplePath = path.resolve(docRoot, 'zh-CN/demos/', componentId)
  if (!fs.existsSync(examplePath))
    return []
  const files = fs.readdirSync(examplePath)
  const imports: string[] = []

  for (const item of files) {
    if (!/\.vue$/.test(item))
      continue
    const file = item.replace(/\.vue$/, '')
    const name = camelize(`formily-ep-${componentId}-${file}`)

    imports.push(
      `import ${name} from '../demos/${componentId}/${file}.vue'`,
    )
  }

  return imports
}
