<script setup>
import EmptyState from "@/components/ui/EmptyState.vue";
</script>

<template>
  <div class="mx-auto max-w-xl py-8">
    <EmptyState title="Không tìm thấy trang" description="Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển.">
      <RouterLink
        :to="{ name: 'home' }"
        class="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      >
        Về trang chủ
      </RouterLink>
    </EmptyState>
  </div>
</template>