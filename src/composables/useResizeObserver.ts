import { ref, onMounted, onUnmounted } from 'vue'
import type { Dimensions } from '@/types/dimensions'

export function useResizeObserver(selector: string) {
  const dimensions = ref<Dimensions>({ width: 0, height: 0 })

  onMounted(() => {
    const element = document.querySelector(selector)
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        dimensions.value = {
          width: entry.contentRect.width,
          height: entry.contentRect.height
        }
      })
    })

    resizeObserver.observe(element)

    onUnmounted(() => {
      resizeObserver.unobserve(element)
    })
  })

  return dimensions
} 