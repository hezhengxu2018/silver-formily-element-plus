import type MarkdownIt from 'markdown-it'
import type Renderer from 'markdown-it/lib/renderer.mjs'
import type Token from 'markdown-it/lib/token.mjs'
import fs from 'node:fs'
import path from 'node:path'

interface ContainerOpts {
  marker?: string | undefined
  validate?: (params: string) => boolean
  render?: (
    tokens: Token[],
    index: number,
    options: any,
    env: any,
    self: Renderer
  ) => string
}

function createDemoContainer(md: MarkdownIt): ContainerOpts {
  return {
    validate(params) {
      return !!/^demo.*$/.test(params.trim())
    },

    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo.*$/)
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const description = m && m.length > 1 ? m[1] : ''
        const sourceFileToken = tokens[idx + 2]
        let source = ''
        const sourceFile = sourceFileToken.children?.[0].content ?? ''
        if (sourceFileToken.type === 'inline') {
          source = fs.readFileSync(
            path.resolve('./docs/zh-CN/demos', `${sourceFile}.vue`),
            'utf8',
          )
        }
        if (!source)
          throw new Error(`Incorrect source file: ${sourceFile}`)

        return `<ClientOnly> <Demo source="${encodeURIComponent(
          md.render(`\`\`\` vue\n${source}\`\`\``),
        )}" path="${sourceFile}" raw-source="${encodeURIComponent(
          source,
        )}" description="${encodeURIComponent(md.render(description))}">
  <template #source><formily-ep-${sourceFile.replaceAll('/', '-')}/></template>`
      }
      else {
        return '</Demo>\n </ClientOnly>'
      }
    },

  }
}

export default createDemoContainer
