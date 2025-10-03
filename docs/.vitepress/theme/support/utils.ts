import { useData, withBase } from 'vitepress'
import { isExternal, treatAsHtml } from '../shared'

export function throttleAndDebounce(fn: () => void, delay: number): () => void {
  let timeoutId: NodeJS.Timeout
  let called = false

  return () => {
    if (timeoutId)
      clearTimeout(timeoutId)

    // eslint-disable-next-line style/max-statements-per-line
    if (called) { timeoutId = setTimeout(fn, delay) }
    else {
      fn()
      ;(called = true) && setTimeout(() => (called = false), delay)
    }
  }
}

export function ensureStartingSlash(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

export function normalizeLink(url: string): string {
  const { pathname, search, hash, protocol } = new URL(url, 'http://a.com')

  if (
    isExternal(url)
    || url.startsWith('#')
    || !protocol.startsWith('http')
    || !treatAsHtml(pathname)
  ) {
    return url
  }

  const { site } = useData()

  const normalizedPath
    = pathname.endsWith('/') || pathname.endsWith('.html')
      ? url
      : url.replace(
          // eslint-disable-next-line regexp/optimal-quantifier-concatenation
          /(?:(^\.+)\/)?.*$/,
          `$1${pathname.replace(
            /(\.md)?$/,
            site.value.cleanUrls ? '' : '.html',
          )}${search}${hash}`,
        )

  return withBase(normalizedPath)
}
