<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

defineProps({
  label: { type: String, default: "Đang tải..." },
});

// Máy chủ miễn phí tự "ngủ" khi không có ai dùng nên lần gọi đầu có thể mất khoảng một phút.
// Nếu chờ lâu thì giải thích cho người dùng, tránh để họ nghĩ trang bị treo.
const showSlowHint = ref(false);
let timer = null;

onMounted(() => {
  timer = setTimeout(() => {
    showSlowHint.value = true;
  }, 6000);
});

onBeforeUnmount(() => {
  clearTimeout(timer);
});
</script>

<template>
  <div class="py-12 text-center text-slate-500" role="status">
    <div class="flex items-center justify-center gap-3">
      <svg class="h-6 w-6 animate-spin text-blue-700" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <span class="text-sm">{{ label }}</span>
    </div>
    <p v-if="showSlowHint" class="mx-auto mt-3 max-w-md text-sm text-slate-500">
      Máy chủ miễn phí có thể mất khoảng một phút để khởi động lại sau thời gian không hoạt động. Vui lòng chờ...
    </p>
  </div>
</template>