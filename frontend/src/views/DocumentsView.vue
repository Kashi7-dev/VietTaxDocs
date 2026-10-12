<script setup>
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { documentsApi, taxTypesApi } from "@/services/api";
import { useAsync } from "@/composables/useAsync";
import DocumentFilters from "@/components/documents/DocumentFilters.vue";
import DocumentCard from "@/components/documents/DocumentCard.vue";
import PaginationBar from "@/components/ui/PaginationBar.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import ErrorAlert from "@/components/ui/ErrorAlert.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const PAGE_SIZE = 10;

const route = useRoute();
const router = useRouter();

// Địa chỉ URL là nguồn sự thật của bộ lọc: lọc xong URL đổi, người dùng có thể
// gửi đường dẫn cho người khác, bấm nút Quay lại vẫn về đúng kết quả cũ.
function queryText(value) {
  return typeof value === "string" ? value : "";
}

const filters = computed(() => ({
  search: queryText(route.query.search),
  taxType: queryText(route.query.tax_type),
  status: queryText(route.query.status),
}));

const page = computed(() => {
  const number = Number(route.query.page);
  return Number.isInteger(number) && number >= 1 ? number : 1;
});

const { data: result, loading, error, run: load } = useAsync((params) => documentsApi.list(params));
const { data: taxTypes, run: loadTaxTypes } = useAsync(() => taxTypesApi.list());

function fetchDocuments() {
  load({
    search: filters.value.search,
    tax_type: filters.value.taxType,
    status: filters.value.status,
    page: page.value,
    page_size: PAGE_SIZE,
  });
}

// Mỗi khi query string đổi (lọc, đổi trang, bấm Quay lại) thì tải lại dữ liệu.
watch(
  () => route.query,
  () => {
    if (route.name === "documents") fetchDocuments();
  },
  { immediate: true },
);

loadTaxTypes();

function applyFilters(values) {
  const query = {};
  if (values.search) query.search = values.search;
  if (values.taxType) query.tax_type = values.taxType;
  if (values.status) query.status = values.status;
  router.push({ name: "documents", query });
}

function resetFilters() {
  router.push({ name: "documents" });
}

function changePage(newPage) {
  router.push({ name: "documents", query: { ...route.query, page: String(newPage) } });
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">Văn bản pháp luật về thuế</h1>
      <p class="mt-1 text-slate-600">Tìm kiếm theo từ khóa, loại thuế và tình trạng hiệu lực.</p>
    </div>

    <DocumentFilters
      :model-value="filters"
      :tax-types="taxTypes || []"
      @search="applyFilters"
      @reset="resetFilters"
    />

    <section aria-live="polite">
      <LoadingSpinner v-if="loading" />
      <ErrorAlert v-else-if="error" :message="error.message" retryable @retry="fetchDocuments" />
      <template v-else-if="result">
        <EmptyState
          v-if="result.data.length === 0"
          title="Không tìm thấy văn bản phù hợp"
          description="Hãy thử bớt từ khóa hoặc bỏ bớt bộ lọc."
        >
          <BaseButton variant="secondary" @click="resetFilters">Xóa bộ lọc</BaseButton>
        </EmptyState>

        <template v-else>
          <p class="mb-3 text-sm text-slate-600">
            Tìm thấy <strong class="text-slate-900">{{ result.total }}</strong> văn bản
          </p>
          <ul class="space-y-4">
            <li v-for="item in result.data" :key="item.id">
              <DocumentCard :doc="item" />
            </li>
          </ul>
          <PaginationBar
            class="mt-6"
            :page="result.page"
            :page-size="result.page_size"
            :total="result.total"
            @change="changePage"
          />
        </template>
      </template>
    </section>
  </div>
</template>