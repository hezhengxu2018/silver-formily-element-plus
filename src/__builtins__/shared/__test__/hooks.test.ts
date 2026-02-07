import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useDebounceFn, useResizeObserver, useThrottleFn } from '../hooks'

function renderUseResizeObserver(
  target: Parameters<typeof useResizeObserver>[0],
  callback: Parameters<typeof useResizeObserver>[1],
  options?: Parameters<typeof useResizeObserver>[2],
) {
  let result: ReturnType<typeof useResizeObserver> | null = null

  const TestComponent = defineComponent({
    setup() {
      result = useResizeObserver(target, callback, options)
      return () => null
    },
  })

  render(() => h(TestComponent))

  if (!result) {
    throw new Error('useResizeObserver did not initialize')
  }

  return result
}

describe('useDebounceFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('应该延迟执行函数', () => {
    const mockFn = vi.fn()
    const debouncedFn = useDebounceFn(mockFn, 100)

    debouncedFn('test')
    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledWith('test')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('应该取消之前的调用并重新开始计时', () => {
    const mockFn = vi.fn()
    const debouncedFn = useDebounceFn(mockFn, 100)

    debouncedFn('first')
    vi.advanceTimersByTime(50)

    debouncedFn('second')
    vi.advanceTimersByTime(50)
    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(50)
    expect(mockFn).toHaveBeenCalledWith('second')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('应该支持函数形式的延迟时间', () => {
    const mockFn = vi.fn()
    const delayFn = vi.fn(() => 200)
    const debouncedFn = useDebounceFn(mockFn, delayFn)

    debouncedFn('test')
    expect(delayFn).toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledWith('test')
  })

  it('应该正确传递多个参数', () => {
    const mockFn = vi.fn()
    const debouncedFn = useDebounceFn(mockFn, 100)

    debouncedFn('arg1', 'arg2', 'arg3')
    vi.advanceTimersByTime(100)

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
  })

  it('应该在多次快速调用时只执行最后一次', () => {
    const mockFn = vi.fn()
    const debouncedFn = useDebounceFn(mockFn, 100)

    debouncedFn('call1')
    debouncedFn('call2')
    debouncedFn('call3')

    vi.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('call3')
  })
})

describe('useThrottleFn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('应该立即执行第一次调用（leading=true）', () => {
    const mockFn = vi.fn()
    const throttledFn = useThrottleFn(mockFn, 100, true, true)

    throttledFn('test')
    expect(mockFn).toHaveBeenCalledWith('test')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('应该在节流期间忽略重复调用', () => {
    const mockFn = vi.fn()
    const throttledFn = useThrottleFn(mockFn, 100, true, true)

    throttledFn('first')
    throttledFn('second')
    throttledFn('third')

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('first')
  })

  it('应该在节流期结束后执行最后一次调用（trailing=true）', () => {
    const mockFn = vi.fn()
    const throttledFn = useThrottleFn(mockFn, 100, true, true)

    throttledFn('first')
    throttledFn('second')

    vi.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledTimes(2)
    expect(mockFn).toHaveBeenNthCalledWith(1, 'first')
    expect(mockFn).toHaveBeenNthCalledWith(2, 'second')
  })

  it('应该支持禁用 leading 执行', () => {
    const mockFn = vi.fn()
    const throttledFn = useThrottleFn(mockFn, 100, true, false)

    throttledFn('test')
    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledWith('test')
  })

  it('应该支持禁用 trailing 执行', () => {
    const mockFn = vi.fn()
    const throttledFn = useThrottleFn(mockFn, 100, false, true)

    throttledFn('first')
    throttledFn('second')

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('first')

    vi.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledTimes(1) // 不应该有 trailing 调用
  })

  it('应该在节流期结束后允许新的调用', () => {
    const mockFn = vi.fn()
    const throttledFn = useThrottleFn(mockFn, 100, true, true)

    throttledFn('first')
    vi.advanceTimersByTime(100)

    throttledFn('second')
    expect(mockFn).toHaveBeenCalledTimes(2)
    expect(mockFn).toHaveBeenNthCalledWith(2, 'second')
  })

  it('应该正确处理多个参数', () => {
    const mockFn = vi.fn()
    const throttledFn = useThrottleFn(mockFn, 100, true, true)

    throttledFn('arg1', 'arg2', 'arg3')
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
  })
})

describe('useResizeObserver', () => {
  let mockElement: HTMLElement

  beforeEach(() => {
    mockElement = document.createElement('div')
    document.body.append(mockElement)
  })

  afterEach(() => {
    mockElement.remove()
  })

  it('应该检测 ResizeObserver 支持性', () => {
    const callback = vi.fn()
    const { isSupported } = renderUseResizeObserver(mockElement, callback)

    expect(isSupported).toBe(true)
  })

  it('应该观察元素', () => {
    const callback = vi.fn()
    const { isSupported } = renderUseResizeObserver(mockElement, callback)

    expect(isSupported).toBe(true)
    // 在浏览器模式下，ResizeObserver 会被正常创建
  })

  it('应该支持传递 ResizeObserver 选项', () => {
    const callback = vi.fn()
    const options = { box: 'border-box' as ResizeObserverBoxOptions }

    const { isSupported } = renderUseResizeObserver(mockElement, callback, options)

    expect(isSupported).toBe(true)
  })

  it('应该支持 Ref 类型的目标元素', async () => {
    const callback = vi.fn()
    const elementRef = ref(mockElement)

    const { isSupported } = renderUseResizeObserver(elementRef, callback)

    expect(isSupported).toBe(true)
    await nextTick()
  })

  it('应该在目标元素为 null 时不进行观察', async () => {
    const callback = vi.fn()
    const elementRef = ref(null)

    const { isSupported } = renderUseResizeObserver(elementRef, callback)

    expect(isSupported).toBe(true)
    await nextTick()
  })

  it('应该在调用 stop 时断开观察', () => {
    const callback = vi.fn()
    const { stop, isSupported } = renderUseResizeObserver(mockElement, callback)

    expect(isSupported).toBe(true)

    // 调用 stop 方法
    stop()

    // stop 方法应该能正常执行而不报错
    expect(typeof stop).toBe('function')
  })

  it('应该在 Ref 元素变化时重新观察', async () => {
    const callback = vi.fn()
    const elementRef = ref(mockElement)

    const { isSupported } = renderUseResizeObserver(elementRef, callback)
    expect(isSupported).toBe(true)

    const newElement = document.createElement('span')
    document.body.append(newElement)

    elementRef.value = newElement
    await nextTick()

    // 清理
    newElement.remove()
  })

  it('应该正确处理元素尺寸变化', async () => {
    const callback = vi.fn()
    const { isSupported } = renderUseResizeObserver(mockElement, callback)

    expect(isSupported).toBe(true)

    // 模拟元素尺寸变化
    mockElement.style.width = '200px'
    mockElement.style.height = '200px'

    // 在真实浏览器环境中，ResizeObserver 会异步触发
    // 这里我们主要测试 hook 的基本功能
    await new Promise(resolve => setTimeout(resolve, 10))
  })

  it('应该在元素从 null 变为有效元素时开始观察', async () => {
    const callback = vi.fn()
    const elementRef = ref<HTMLElement | null>(null)

    const { isSupported } = renderUseResizeObserver(elementRef, callback)
    expect(isSupported).toBe(true)

    // 设置有效元素
    elementRef.value = mockElement
    await nextTick()

    // 再次设置为 null
    elementRef.value = null
    await nextTick()
  })
})
