<script setup>
import { computed, watch } from "vue";
import { documentsApi } from "@/services/api";
import { useAsync } from "@/composables/useAsync";
import { DOCUMENT_TYPE_LABELS, formatDate, safeUrl } from "@/utils/format";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import ErrorAlert from "@/components/ui/ErrorAlert.vue";
import EmptyState from "@/components/ui/EmptyState.vue";

// Prop "id" do router truyền vào từ đường dẫn /documents/:id (cấu hình props: true).
const props = defineProps({
  id: { type: String, required: true },
});

const { data: doc, loading, error, run: load } = useAsync((id) => documentsApi.get(id));

watch(
  () => props.id,
  (id) => load(id),
  { immediate: true },
);

// id không phải số (400) hoặc không có văn bản (404) đều coi là "không tìm thấy".
const notFound = computed(() => Boolean(error.value) && [400, 404].includes(error.value.status));

// Chỉ dùng liên kết http(s) để tránh địa chỉ nguy hiểm từ dữ liệu bên ngoài.
const pdfUrl = computed(() => (doc.value ? safeUrl(doc.value.pdf_url) : null));
const sourceUrl = computed(() => (doc.value ? safeUrl(doc.value.source_url) : null));
</script>

<template>
  <div>
    <nav class="mb-4 text-sm text-slate-500" aria-label="Đường dẫn">
      <RouterLink :to="{ name: 'home' }" class="hover:text-blue-700">Trang chủ</RouterLink>
      <span class="mx-2">/</span>
      <RouterLink :to="{ name: 'documents' }" class="hover:text-blue-700">Văn bản</RouterLink>
      <template v-if="doc">
        <span class="mx-2">/</span>
        <span class="text-slate-700">{{ doc.document_number }}</span>
      </template>
    </nav>

    <LoadingSpinner v-if="loading" />

    <EmptyState
      v-else-if="notFound"
      title="Không tìm thấy văn bản"
      description="Văn bản này không tồn tại hoặc đã bị gỡ."
    >
      <RouterLink
        :to="{ name: 'documents' }"
        class="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      >
        Về danh sách văn bản
      </RouterLink>
    </EmptyState>

    <ErrorAlert v-else-if="error" :message="error.message" retryable @retry="load(id)" />

    <article v-else-if="doc" class="space-y-6">
      <header class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
            {{ DOCUMENT_TYPE_LABELS[doc.document_type] || doc.document_type }}
          </span>
          <StatusBadge :status="doc.status" />
        </div>

        <h1 class="mt-3 text-2xl font-bold leading-snug text-slate-900">{{ doc.title }}</h1>

        <dl class="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-slate-500">Số hiệu</dt>
            <dd class="font-medium text-slate-900">{{ doc.document_number }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Cơ quan ban hành</dt>
            <dd class="font-medium text-slate-900">{{ doc.issuing_agency ? doc.issuing_agency.name : "—" }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Ngày ban hành</dt>
            <dd class="font-medium text-slate-900">{{ formatDate(doc.issue_date) }}</dd>
          </div>
          <div>
            <dt class="text-slate-500">Ngày có hiệu lực</dt>
            <dd class="font-medium text-slate-900">{{ formatDate(doc.effective_date) }}</dd>
          </div>
          <div v-if="doc.expiry_date">
            <dt class="text-slate-500">Ngày hết hiệu lực</dt>
            <dd class="font-medium text-slate-900">{{ formatDate(doc.expiry_date) }}</dd>
          </div>
          <div v-if="doc.tax_types.length > 0" class="sm:col-span-2">
            <dt class="text-slate-500">Loại thuế liên quan</dt>
            <dd class="mt-1 flex flex-wrap gap-2">
              <RouterLink
                v-for="item in doc.tax_types"
                :key="item.id"
                :to="{ name: 'documents', query: { tax_type: item.code } }"
                class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {{ item.name }}
              </RouterLink>
            </dd>
          </div>
        </dl>

        <div class="mt-6 flex flex-wrap gap-3">
          <a
            v-if="pdfUrl"
            :href="pdfUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Tải bản PDF
          </a>
          <span
            v-else
            class="inline-flex items-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500"
          >
            Chưa có tệp PDF
          </span>

          <a
            v-if="sourceUrl"
            :href="sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Xem nguồn gốc
          </a>
        </div>
      </header>

      <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="content-heading">
        <h2 id="content-heading" class="text-lg font-bold text-slate-900">Nội dung</h2>
        <!-- Hiển thị dạng văn bản thuần, không chèn HTML thô, để nội dung từ bên ngoài không thể chèn mã độc. -->
        <p class="mt-3 whitespace-pre-line text-slate-700">{{ doc.content }}</p>
      </section>

      <p class="text-xs text-slate-500">
        Thông tin chỉ mang tính tham khảo. Hãy đối chiếu với văn bản gốc của cơ quan ban hành.
      </p>
    </article>
  </div>
</template>