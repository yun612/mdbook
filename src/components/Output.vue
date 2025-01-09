<template>
  <div class="output-wrapper dark:bg-zinc-900">
    <div v-if="currentOutput.data.length === 0" class="empty-state">
      No output yet. Run some code to see results here.
    </div>
    <div v-else class="output-list">
      <div
        v-for="(output, index) in currentOutput.data"
        :key="index"
        class="output-item"
        :class="output.color"
      >
        <pre>{{ output.msg.join(' ') }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const currentOutput = computed(() => store.outputs[store.editor.lang])
</script>

<style scoped>
.output-wrapper {
  padding: 1rem;
  height: 100vh;
  overflow-y: auto;
  color: #e4e4e7;
}

.empty-state {
  text-align: center;
  color: #71717a;
  padding: 2rem;
}

.output-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.output-item {
  padding: 0.5rem;
  border-radius: 0.375rem;
  font-family: monospace;
}

.output-item.normal {
  background-color: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
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