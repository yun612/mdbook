/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'monaco-editor-vue3' {
  import type { DefineComponent } from 'vue'
  const MonacoEditor: DefineComponent<{
    modelValue?: string
    theme?: string
    language?: string
    options?: any
    readOnly?: boolean
    onChange?: (value: string) => void
  }>
  export default MonacoEditor
} 