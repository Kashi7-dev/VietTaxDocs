<script setup>
import { DOCUMENT_TYPE_LABELS, formatDate } from "@/utils/format";
import StatusBadge from "@/components/ui/StatusBadge.vue";

defineProps({
  // Một phần tử trong danh sách trả về của GET /documents
  doc: { type: Object, required: true },
});
</script>

<template>
  <article
    class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md sm:p-5"
  >
    <div class="flex flex-wrap items-center gap-2">
      <span class="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
        {{ DOCUMENT_TYPE_LABELS[doc.document_type] || doc.document_type }}
      </span>
      <StatusBadge :status="doc.status" />
    </div>

    <h3 class="mt-2 text-base font-semibold leading-snug text-slate-900 sm:text-lg">
      <RouterLink
        :to="{ name: 'document-detail', params: { id: doc.id } }"
        class="hover:text-blue-700 focus-visible:underline"
      >
        {{ doc.title }}
      </RouterLink>
    </h3>

    <dl class="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
      <div>
        <dt class="inline text-slate-500">Số hiệu: </dt>
        <dd class="inline font-medium text-slate-700">{{ doc.document_number }}</dd>
      </div>
      <div>
        <dt class="inline text-slate-500">Ban hành: </dt>
        <dd class="inline font-medium text-slate-700">{{ formatDate(doc.issue_date) }}</dd>
      </div>
      <div>
        <dt class="inline text-slate-500">Hiệu lực: </dt>
        <dd class="inline font-medium text-slate-700">{{ formatDate(doc.effective_date) }}</dd>
      </div>
    </dl>
  </article>
</template>