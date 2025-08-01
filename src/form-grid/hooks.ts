import type { Grid as IGrid } from '@formily/grid'
import type { InjectionKey, Ref } from 'vue'
import { inject } from 'vue'

export const FormGridSymbol: InjectionKey<Ref<IGrid<HTMLElement>>> = Symbol('FormGridContext')

export const useFormGrid = (): Ref<IGrid<HTMLElement>> => inject(FormGridSymbol)
