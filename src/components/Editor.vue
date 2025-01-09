<template>
  <div class="editor-wrapper dark:bg-zinc-800">
    <Buttons />
    <MonacoEditor
      v-model="code"
      :options="editorOptions"
      :theme="store.editor.theme === 'dark' ? 'vs-dark' : 'vs'"
      :language="store.editor.lang"
      class="monaco-editor"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import MonacoEditor from 'monaco-editor-vue3'
import Buttons from './Buttons.vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const code = ref(store.editor.code)

// Sync code changes from store to editor
watch(() => store.editor.code, (newCode) => {
  code.value = newCode
})

const editorOptions = {
  fontSize: 16,
  lineNumbers: 'off',
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: store.editor.lang === 'python' ? 4 : 2,
  wordWrap: 'on'
}

const handleChange = (value: string) => {
  store.updateEditor({ code: value })
}

// Keyboard shortcut handler
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'r') {
    e.preventDefault()
    store.executeCode()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.editor-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 1rem;
  gap: 1rem;
}

.monaco-editor {
  flex: 1;
  border-radius: 0.375rem;
  overflow: hidden;
}
</style> 