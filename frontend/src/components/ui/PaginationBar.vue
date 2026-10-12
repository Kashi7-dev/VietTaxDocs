<script setup>
import { computed } from "vue";

const props = defineProps({
  page: { type: Number, required: true },
  pageSize: { type: Number, required: true },
  total: { type: Number, required: true },
});

const emit = defineEmits(["change"]);

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
const isFirstPage = computed(() => props.page <= 1);
const isLastPage = computed(() => props.page >= totalPages.value);

// Hiển thị tối đa 5 số trang quanh trang hiện tại.
const pages = computed(() => {
  const spread = 2;
  const start = Math.max(1, props.page - spread);
  const end = Math.min(totalPages.value, props.page + spread);
  const list = [];
  for (let p = start; p <= end; p++) {
    list.push(p);
  }
  return list;
});

function go(target) {
  if (target >= 1 && target <= totalPages.value && target !== props.page) {
    emit("change", target);
  }
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="flex flex-wrap items-center justify-between gap-3"
    aria-label="Phân trang"
  >
    <p class="text-sm text-slate-500">Trang {{ page }} / {{ totalPages }}</p>

    <div class="flex items-center gap-1">
      <button
        type="button"
        class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="isFirstPage"
        @click="go(page - 1)"
      >
        Trước
      </button>

      <button
        v-for="p in pages"
        :key="p"
        type="button"
        :aria-current="p === page ? 'page' : undefined"
        :class="[
          'min-w-9 rounded-lg border px-3 py-1.5 text-sm font-medium',
          p === page
            ? 'border-blue-700 bg-blue-700 text-white'
            : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
        ]"
        @click="go(p)"
      >
        {{ p }}
      </button>

      <button
        type="button"
        class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="isLastPage"
        @click="go(page + 1)"
      >
        Sau
      </button>
    </div>
  </nav>
</template>