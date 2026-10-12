<script setup>
import { computed } from "vue";
import { notificationsApi } from "@/services/api";
import { useAsync } from "@/composables/useAsync";
import NotificationItem from "@/components/notifications/NotificationItem.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import ErrorAlert from "@/components/ui/ErrorAlert.vue";
import EmptyState from "@/components/ui/EmptyState.vue";

const { data: notifications, loading, error, run: load } = useAsync(() => notificationsApi.list());

load();

const unreadCount = computed(() =>
  notifications.value ? notifications.value.filter((item) => !item.is_read).length : 0,
);
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">Thông báo</h1>
      <p v-if="notifications && notifications.length > 0" class="mt-1 text-slate-600">
        Bạn có {{ unreadCount }} thông báo chưa đọc.
      </p>
    </div>

    <LoadingSpinner v-if="loading" />
    <ErrorAlert v-else-if="error" :message="error.message" retryable @retry="load" />
    <EmptyState
      v-else-if="!notifications || notifications.length === 0"
      title="Bạn chưa có thông báo nào"
      description="Thông báo sẽ xuất hiện khi có văn bản mới thuộc loại thuế bạn quan tâm."
    >
      <RouterLink
        :to="{ name: 'documents' }"
        class="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      >
        Xem văn bản
      </RouterLink>
    </EmptyState>
    <ul v-else class="space-y-3">
      <li v-for="item in notifications" :key="item.id">
        <NotificationItem :notification="item" />
      </li>
    </ul>
  </div>
</template>