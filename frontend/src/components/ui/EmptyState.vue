<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: "" },
});
</script>

<template>
  <div class="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
    <h3 class="text-base font-semibold text-slate-900">{{ title }}</h3>
    <p v-if="description" class="mx-auto mt-1 max-w-md text-sm text-slate-500">{{ description }}</p>
    <div v-if="$slots.default" class="mt-4 flex justify-center">
      <slot />
    </div>
  </div>
</template>