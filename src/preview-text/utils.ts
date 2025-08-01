import type { SpaceProps, TagProps, TextProps } from 'element-plus'
import { computed, inject } from 'vue'

export interface PreviewTextProps {
  placeholder?: string
  tagProps?: Partial<TagProps>
  spaceProps?: Partial<SpaceProps>
  textProps?: Partial<TextProps>
}

export const previewTextConfigKey = Symbol('previewTextConfig')

export function usePreviewConfig() {
  const previewConfig = inject(previewTextConfigKey, {}) as PreviewTextProps
  const placeholder = computed(() => previewConfig?.placeholder || 'N/A')
  const tagProps = computed<Partial<TagProps>>(() => previewConfig?.tagProps ?? { type: 'info' })
  const spaceProps = computed(() => previewConfig?.spaceProps || {})
  const textProps = computed(() => previewConfig?.textProps || {})
  return {
    placeholder,
    tagProps,
    spaceProps,
    textProps,
  }
}
