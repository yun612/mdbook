<template>
  <div class="flex gap-2">
    <button
      @click="store.clearOutput"
      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-zinc-700 dark:text-gray-200 dark:border-zinc-600 dark:hover:bg-zinc-600"
    >
      Clear
    </button>
    <select
      v-model="store.editor.lang"
      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-zinc-700 dark:text-gray-200 dark:border-zinc-600 dark:hover:bg-zinc-600"
    >
      <option value="python">Python</option>
      <option value="typescript">TypeScript</option>
      <option value="javascript">JavaScript</option>
    </select>
    <button
      @click="store.executeCode"
      class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
    >
      Run (Ctrl+R)
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const store = useAppStore()
</script> 