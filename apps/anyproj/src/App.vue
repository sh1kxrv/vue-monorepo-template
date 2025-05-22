<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import LayoutDefault from '#/layouts/layout.default.vue'

const route = useRoute()

const layouts = {
  default: LayoutDefault,
}

const meta = computed(() => route.meta)
const layoutComponent = computed(
  () => layouts[(meta.value.layout || 'default') as keyof typeof layouts],
)
</script>

<template>
  <component :is="layoutComponent">
    <RouterView />
  </component>
</template>
