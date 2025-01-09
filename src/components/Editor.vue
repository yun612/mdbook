<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import MonacoEditor from 'monaco-editor-vue3'
import { useClipboard } from '@vueuse/core'
import { useAppStore } from '@/stores/app'

const { copy, copied } = useClipboard({})
const store = useAppStore()
const currentOutput = computed(() => store.outputs[store.editor.lang])

const initCode = '# Default python code\n\nprint("Hello, python")'
const code = ref(store.editor.code || initCode)


watch(() => store.editor.code, (newCode) => {
  code.value = newCode
})

const editorOptions = {
  fontSize: 16,
  lineNumbers: 'on',
  minimap: { enabled: false },
  scrollBeyondLastLine: true,
  automaticLayout: true,
  tabSize: store.editor.lang === 'python' ? 4 : 2,
  wordWrap: 'on',
  lineNumbersMinChars: 2,
  renderLineHighlight: 'all',
  lineDecorationsWidth: 0,
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

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown)
  await nextTick(); // 确保 DOM 更新完成
  if (store.editor.code) {
    code.value = store.editor.code;
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

function clearOutput() {
  store.clearOutput()
  store.editor.code = initCode
  code.value = initCode
}
</script>


<template>
  <div class="dark:bg-zinc-800 p-5">
    <div class="flex items-center justify-between">
      <p class="text-lg font-semibold text-white  rounded-md">Python Editor</p>
      <div class="flex items-center gap-x-4">
        <span v-if="copied" class="text-green-300 text-xs">Copied !</span>
        <button class="border p-1 rounded-md border-gray-500 text-gray-400 hover:text-gray-200"
          @click="copy(store.editor.code)">
          <svg v-if="copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="m9.55 15.15l8.475-8.475q.3-.3.7-.3t.7.3t.3.713t-.3.712l-9.175 9.2q-.3.3-.7.3t-.7-.3L4.55 13q-.3-.3-.288-.712t.313-.713t.713-.3t.712.3z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V6h2v14h11v2zm4-6V4z" />
          </svg>
        </button>

        <button @click="clearOutput()" class="border p-1 rounded-md border-gray-500 text-gray-400 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" d="m18.5 5.5l-13 13" />
              <circle cx="12" cy="12" r="10" />
            </g>
          </svg>
        </button>

        <button class="border p-1 rounded-md border-gray-500 text-gray-400 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" @click="store.executeCode">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 4v16l13-8z" />
          </svg>

          <!-- <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" >
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path stroke-dasharray="16" stroke-dashoffset="16" d="M12 3c4.97 0 9 4.03 9 9">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0" />
                <animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate"
                  values="0 12 12;360 12 12" />
              </path>
              <path stroke-dasharray="64" stroke-dashoffset="64" stroke-opacity=".3"
                d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="1.2s" values="64;0" />
              </path>
            </g>
          </svg> -->
        </button>
      </div>
    </div>
    <p class="border-t my-2 border-gray-400"></p>
    <MonacoEditor class="min-h-40" language="python" v-model:value="code" :options="editorOptions"
      :theme="store.editor.theme === 'dark' ? 'vs-dark' : 'vs'" @change="handleChange" />

    <div class="output-wrapper dark:bg-zinc-900 py-3">
      <div v-if="currentOutput.data.length === 0" class="text-center text-gray-300">
        No output yet. Run some code to see results here.
      </div>
      <div v-else class="output-list">
        <div v-for="(output, index) in currentOutput.data" :key="index" class="output-item flex items-center gap-x-2"
          :class="output.color">
          <p>></p>
          <pre>{{ output.msg.join(' ') }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>


<style>
.output-list {
  display: flex;
  flex-direction: column;
}

.output-item {
  padding-inline: 0.2rem;
  border-radius: 0.375rem;
  font-family: monospace;
}

.output-item.normal {
  /* background-color: rgba(34, 197, 94, 0.1); */
  /* border: 1px solid rgba(34, 197, 94, 0.2); */
}

.output-item.red {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.output-item.yellow {
  background-color: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.2);
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>