<template>
  <main class="flex">
    <Editor class="w-1/2" />
    <Output class="w-1/2" />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import Editor from '@/components/Editor.vue'
import Output from '@/components/Output.vue'

const store = useAppStore()

onMounted(() => {
  const cleanup = store.initMessageListener()
  return cleanup
})
</script> 