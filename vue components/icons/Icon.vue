<template>
  <span class="icon-wrapper" v-html="svgContent"></span>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: '24'
  }
})

const svgContent = ref('')

// Import all SVGs from the icons folder
const icons = import.meta.glob('/icons/*.svg', { as: 'raw', eager: true })

const loadIcon = () => {
  const iconPath = `/icons/${props.name}.svg`
  
  if (icons[iconPath]) {
    let svg = icons[iconPath] as string
    
    // Replace width and height attributes with the size prop
    svg = svg.replace(/width="[^"]*"/, `width="${props.size}"`)
    svg = svg.replace(/height="[^"]*"/, `height="${props.size}"`)
    
    svgContent.value = svg
  } else {
    console.warn(`Icon "${props.name}" not found in /icons/`)
  }
}

onMounted(loadIcon)
watch(() => [props.name, props.size], loadIcon)
</script>

<style scoped>
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper :deep(svg) {
  display: block;
}
</style>
