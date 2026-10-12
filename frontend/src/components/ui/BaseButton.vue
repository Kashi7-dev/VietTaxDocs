<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: { type: String, default: "primary" }, // primary | secondary | ghost | danger
  type: { type: String, default: "button" },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
});

const variantClass = computed(() => {
  const variants = {
    primary: "bg-blue-700 text-white hover:bg-blue-800 focus-visible:outline-blue-700",
    secondary:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-slate-500",
    ghost: "text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
  };
  return variants[props.variant] || variants.primary;
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
      variantClass,
      block ? 'w-full' : '',
    ]"
  >
    <svg v-if="loading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
    <slot />
  </button>
</template>