import type { ComponentPublicInstance } from 'vue'

export type DialogLikeInstance = ComponentPublicInstance<{ dialogContentRef?: ComponentPublicInstance | null }> | null

export function resolveDialogElement(instance: DialogLikeInstance): HTMLElement | null {
  const exposedDialogRef = (instance as ComponentPublicInstance & { dialogContentRef?: ComponentPublicInstance | null } | null)?.dialogContentRef
    ?? (instance as ComponentPublicInstance & { exposed?: Record<string, any> } | null)?.exposed?.dialogContentRef
  const dialogElement = exposedDialogRef?.$el as HTMLElement | undefined
  if (dialogElement)
    return dialogElement

  return (instance?.$el as HTMLElement | undefined) ?? null
}

export function resolveDrawerElement(instance: ComponentPublicInstance | null): HTMLElement | null {
  const exposedDrawer = (instance as ComponentPublicInstance & { exposed?: Record<string, any> } | null)?.exposed?.drawerRef
  if (exposedDrawer instanceof HTMLElement)
    return exposedDrawer

  const drawerFromRefs = (instance as ComponentPublicInstance & { $refs?: Record<string, any> } | null)?.$refs?.drawerRef
  if (drawerFromRefs instanceof HTMLElement)
    return drawerFromRefs

  return (instance?.$el as HTMLElement | undefined) ?? null
}
