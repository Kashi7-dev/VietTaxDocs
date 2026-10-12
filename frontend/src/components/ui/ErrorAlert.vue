<script setup>
import BaseButton from "@/components/ui/BaseButton.vue";

defineProps({
  message: { type: String, required: true },
  retryable: { type: Boolean, default: false },
});

const emit = defineEmits(["retry"]);
</script>

<template>
  <div class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
    <p class="text-sm font-medium">{{ message }}</p>
    <div v-if="retryable" class="mt-3">
      <BaseButton variant="secondary" @click="emit('retry')">Thử lại</BaseButton>
    </div>
  </div>
</template>