<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { documentsApi, taxTypesApi } from "@/services/api";
import { useAsync } from "@/composables/useAsync";
import DocumentCard from "@/components/documents/DocumentCard.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import ErrorAlert from "@/components/ui/ErrorAlert.vue";
import EmptyState from "@/components/ui/EmptyState.vue";

const router = useRouter();
const keyword = ref("");

const {
  data: latestData,
  loading: latestLoading,
  error: latestError,
  run: loadLatest,
} = useAsync(() => documentsApi.list({ page: 1, page_size: 5 }));

const { data: taxTypesData, run: loadTaxTypes } = useAsync(() => taxTypesApi.list());

// Gọi ngay trong setup (không đợi onMounted) để lần vẽ đầu tiên đã ở trạng thái "đang tải".
loadLatest();
loadTaxTypes();

function submitSearch() {
  const search = keyword.value.trim();
  router.push({ name: "documents", query: search ? { search } : {} });
}
</script>

<template>
  <div class="space-y-10">
    <section class="rounded-2xl bg-blue-800 px-6 py-10 text-white sm:px-10 sm:py-14">
      <h1 class="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
        Tra cứu văn bản pháp luật về thuế
      </h1>
      <p class="mt-3 max-w-2xl text-blue-100">
        Cập nhật văn bản mới, tra cứu theo loại thuế và tình trạng hiệu lực, đồng thời tính thuế thu nhập cá nhân
        ngay trên một trang.
      </p>

      <form class="mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row" role="search" @submit.prevent="submitSearch">
        <label for="home-search" class="sr-only">Từ khóa tìm kiếm</label>
        <input
          id="home-search"
          v-model="keyword"
          type="search"
          placeholder="Ví dụ: cá nhân quý 4 2025"
          class="w-full flex-1 rounded-lg border border-transparent bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-300"
        />
        <button
          type="submit"
          class="rounded-lg bg-white px-6 py-3 font-semibold text-blue-800 transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Tìm kiếm
        </button>
      </form>

      <div v-if="taxTypesData && taxTypesData.length" class="mt-5 flex flex-wrap items-center gap-2">
        <span class="text-sm text-blue-100">Tra nhanh theo loại thuế:</span>
        <RouterLink
          v-for="item in taxTypesData"
          :key="item.id"
          :to="{ name: 'documents', query: { tax_type: item.code } }"
          :title="item.name"
          class="rounded-full bg-blue-700 px-3 py-1 text-sm font-medium text-white ring-1 ring-blue-400 transition hover:bg-blue-600"
        >
          {{ item.code }}
        </RouterLink>
      </div>
    </section>

    <div class="grid gap-8 lg:grid-cols-3">
      <section class="lg:col-span-2" aria-labelledby="latest-heading">
        <div class="mb-4 flex items-center justify-between">
          <h2 id="latest-heading" class="text-xl font-bold text-slate-900">Văn bản mới nhất</h2>
          <RouterLink :to="{ name: 'documents' }" class="text-sm font-semibold text-blue-700 hover:underline">
            Xem tất cả
          </RouterLink>
        </div>

        <LoadingSpinner v-if="latestLoading" />
        <ErrorAlert v-else-if="latestError" :message="latestError.message" retryable @retry="loadLatest" />
        <EmptyState
          v-else-if="!latestData || latestData.data.length === 0"
          title="Chưa có văn bản nào"
          description="Dữ liệu sẽ xuất hiện khi quản trị viên đăng văn bản mới."
        />
        <ul v-else class="space-y-4">
          <li v-for="item in latestData.data" :key="item.id">
            <DocumentCard :doc="item" />
          </li>
        </ul>
      </section>

      <aside class="space-y-4">
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-base font-bold text-slate-900">Tính thuế thu nhập cá nhân</h2>
          <p class="mt-1 text-sm text-slate-600">
            Nhập thu nhập và các khoản giảm trừ để xem số thuế phải nộp theo từng bậc.
          </p>
          <RouterLink
            :to="{ name: 'tax-calculator' }"
            class="mt-4 inline-block rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Dùng công cụ tính thuế
          </RouterLink>
        </div>

        <div class="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <h2 class="font-bold">Lưu ý</h2>
          <p class="mt-1">
            Thông tin trên trang chỉ mang tính tham khảo. Hãy luôn đối chiếu với văn bản gốc của cơ quan ban hành.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>