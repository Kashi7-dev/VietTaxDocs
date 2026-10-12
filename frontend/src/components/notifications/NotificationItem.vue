<script setup>
import { DOCUMENT_TYPE_LABELS, formatDateTime } from "@/utils/format";

defineProps({
  // Một phần tử trong danh sách trả về của GET /notifications
  notification: { type: Object, required: true },
});
</script>

<template>
  <article
    :class="[
      'flex gap-3 rounded-xl border p-4 shadow-sm',
      notification.is_read ? 'border-slate-200 bg-white' : 'border-blue-200 bg-blue-50',
    ]"
  >
    <span
      :class="['mt-2 h-2.5 w-2.5 shrink-0 rounded-full', notification.is_read ? 'bg-slate-300' : 'bg-blue-600']"
      :title="notification.is_read ? 'Đã đọc' : 'Chưa đọc'"
    />
    <div class="min-w-0 flex-1">
      <p class="text-xs text-slate-500">
        {{ DOCUMENT_TYPE_LABELS[notification.document.document_type] || notification.document.document_type }}
        · {{ formatDateTime(notification.created_at) }}
      </p>
      <h3 class="mt-1 font-semibold leading-snug text-slate-900">
        <RouterLink
          :to="{ name: 'document-detail', params: { id: notification.document.id } }"
          class="hover:text-blue-700 focus-visible:underline"
        >
          {{ notification.document.title }}
        </RouterLink>
      </h3>
      <p class="mt-1 text-sm text-slate-600">Số hiệu: {{ notification.document.document_number }}</p>
    </div>
  </article>
</template>