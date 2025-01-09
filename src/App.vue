<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import Editor from '@/components/Editor.vue'

const store = useAppStore()

onMounted(() => {
  const cleanup = store.initMessageListener()
  return cleanup
})
</script>


<template>
  <main>
    <Editor />
  </main>
</template>
