import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useResizeObserver } from '@/composables/useResizeObserver'
import { defaultCodes } from '@/data/app'
import type { Editor, EditorType, LanguageType } from '@/types/editor'
import type { OutputType, OutputsType } from '@/types/output'
import type { Message } from '@/types/message'

// Import workers
const pythonWorker = new Worker(new URL('../workers/python-worker.js', import.meta.url), { type: 'classic' })
const typescriptWorker = new Worker(new URL('../workers/typescript-worker.js', import.meta.url), { type: 'classic' })
const javascriptWorker = new Worker(new URL('../workers/javascript-worker.js', import.meta.url), { type: 'classic' })

const workers = {
  python: pythonWorker,
  typescript: typescriptWorker,
  javascript: javascriptWorker
}

const defaultOutputs: OutputsType = {
  python: { status: 'loading', data: [] },
  typescript: { status: 'loading', data: [] },
  javascript: { status: 'loading', data: [] }
}

const defaultEditorOptions: EditorType = {
  theme: 'light',
  lang: 'python',
  code: defaultCodes.python,
  defaultCode: defaultCodes.python,
  readonly: false
}

export const useAppStore = defineStore('app', () => {
  const dimensions = useResizeObserver('#app')
  const id = ref('')
  const worker = ref<Worker | null>(workers[defaultEditorOptions.lang])
  const outputs = ref<OutputsType>(defaultOutputs)
  const editor = ref<EditorType>(defaultEditorOptions)

  function postMessage() {
    // Create a plain object with only serializable data
    const currentOutput = outputs.value[editor.value.lang]
    const message: Message = {
      id: id.value,
      editor: {
        lang: editor.value.lang,
        code: editor.value.code,
        theme: editor.value.theme,
        readonly: editor.value.readonly,
        defaultCode: editor.value.defaultCode
      },
      output: {
        status: currentOutput.status,
        data: currentOutput.data.map(item => ({
          msg: [...item.msg],
          color: item.color
        }))
      },
      dimensions: {
        width: dimensions.value.width,
        height: dimensions.value.height
      }
    }

    try {
      // Test if the message can be cloned
      const test = structuredClone(message)
      window.parent.postMessage({ repl: message }, '*')
    } catch (error) {
      console.error('Failed to clone message:', error)
    }
  }

  function executeCode() {
    if (!worker.value) return
    if (outputs.value[editor.value.lang].status === 'loading' || outputs.value[editor.value.lang].status === 'running') return

    outputs.value[editor.value.lang] = { status: 'running', data: [] }
    worker.value.postMessage({ lang: editor.value.lang, code: editor.value.code })
  }

  function clearOutput() {
    outputs.value[editor.value.lang] = { status: 'idle', data: [] }
  }

  function updateEditor(newEditor: Partial<EditorType>) {
    editor.value = { ...editor.value, ...newEditor }
  }

  // Watch for theme changes
  watch(() => editor.value.theme, (newTheme) => {
    document.body.classList.toggle('dark', newTheme === 'dark')
  })

  // Watch for language changes
  watch(() => editor.value.lang, (newLang: LanguageType) => {
    // Update worker reference
    worker.value = workers[newLang]
    
    // Set up message handler for the new worker
    worker.value.onmessage = (event: MessageEvent) => {
      const { lang, output } = event.data
      if (typeof lang !== 'string' || !output) return

      const { status, data } = output
      if (lang === 'python' || lang === 'typescript' || lang === 'javascript') {
        outputs.value[lang] = {
          status,
          data: [...outputs.value[lang].data, ...data]
        }
      }
    }
  })

  // Watch for dimension changes
  watch(() => dimensions.value.height, () => {
    if (id.value) {
      setTimeout(() => postMessage(), 10)
    }
  })

  // Initialize message listener
  function initMessageListener() {
    const onMessage = (event: MessageEvent) => {
      if (event.source === window || !event.data.repl) return
      if (typeof event.data.repl.id !== 'string') return

      const newEditor = { ...editor.value, ...event.data.repl.editor }
      id.value = event.data.repl.id
      editor.value = newEditor
    }

    window.addEventListener('message', onMessage)
    postMessage()

    return () => window.removeEventListener('message', onMessage)
  }

  // Set up initial worker message handler
  if (worker.value) {
    worker.value.onmessage = (event: MessageEvent) => {
      const { lang, output } = event.data
      if (typeof lang !== 'string' || !output) return

      const { status, data } = output
      if (lang === 'python' || lang === 'typescript' || lang === 'javascript') {
        outputs.value[lang] = {
          status,
          data: [...outputs.value[lang].data, ...data]
        }
      }
    }
  }

  return {
    editor,
    outputs,
    executeCode,
    clearOutput,
    updateEditor,
    initMessageListener
  }
}) 