import type { Ref } from 'vue'
import { onUnmounted, watch } from 'vue'

export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number | (() => number),
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return ((...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    const delayMs = typeof delay === 'function' ? delay() : delay

    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delayMs)
  }) as T
}

export function useThrottleFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  trailing = true,
  leading = true,
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastCallTime = 0
  let lastArgs: Parameters<T> | null = null

  return ((...args: Parameters<T>) => {
    const now = Date.now()
    if (lastCallTime === 0 && leading) {
      lastCallTime = now
      fn(...args)
      return
    }
    if (lastCallTime === 0 && !leading) {
      lastCallTime = now
    }

    const remainingTime = delay - (now - lastCallTime)

    lastArgs = args

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    if (remainingTime <= 0 && lastCallTime !== now) {
      lastCallTime = now
      fn(...args)
      lastArgs = null
    }
    else if (trailing) {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now()
        if (lastArgs !== null) {
          fn(...lastArgs)
          lastArgs = null
        }
        timeoutId = null
      }, remainingTime)
    }
  }) as T
}

export function useResizeObserver(
  target: Ref<Element | null> | Element | null,
  callback: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void,
  options?: ResizeObserverOptions,
): {
  isSupported: boolean
  stop: () => void
} {
  let observer: ResizeObserver | null = null
  const isSupported = globalThis.window !== undefined && 'ResizeObserver' in globalThis

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const stop = () => {
    cleanup()
  }

  const start = () => {
    cleanup()

    /* istanbul ignore if @preserve */
    if (!isSupported) {
      return
    }

    const element = (target && 'value' in target ? target.value : target) as Element

    if (!element) {
      return
    }

    observer = new ResizeObserver(callback)
    observer.observe(element, options)
  }

  if (target && 'value' in target) {
    watch(
      target,
      () => {
        start()
      },
      { immediate: true, flush: 'post' },
    )
  }
  else {
    start()
  }
  onUnmounted(() => {
    cleanup()
  })

  return {
    isSupported,
    stop,
  }
}
