<script setup>
import { computed, reactive, watch } from "vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { STATUS_LABELS } from "@/utils/format";

const props = defineProps({
  // Bộ lọc hiện tại (lấy từ URL): { search, taxType, status }
  modelValue: { type: Object, required: true },
  // Danh sách loại thuế từ GET /tax-types
  taxTypes: { type: Array, default: () => [] },
});

const emit = defineEmits(["search", "reset"]);

// Bản sao cục bộ để người dùng gõ thoải mái; chỉ áp dụng khi bấm "Tìm kiếm".
const form = reactive({ search: "", taxType: "", status: "" });

watch(
  () => props.modelValue,
  (value) => {
    form.search = value.search;
    form.taxType = value.taxType;
    form.status = value.status;
  },
  { immediate: true, deep: true },
);

const taxTypeOptions = computed(() =>
  props.taxTypes.map((item) => ({ value: item.code, label: `${item.code} - ${item.name}` })),
);

const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

function submit() {
  emit("search", { search: form.search.trim(), taxType: form.taxType, status: form.status });
}
</script>

<template>
  <form
    class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    role="search"
    novalidate
    @submit.prevent="submit"
  >
    <div class="grid gap-4 md:grid-cols-3">
      <div class="md:col-span-3">
        <BaseInput
          v-model="form.search"
          label="Từ khóa"
          type="search"
          placeholder="Ví dụ: cá nhân quý 4 2025"
          hint="Nhập nhiều từ khóa cách nhau bằng dấu cách, văn bản phải chứa tất cả các từ."
        />
      </div>
      <BaseSelect v-model="form.taxType" label="Loại thuế" placeholder="Tất cả loại thuế" :options="taxTypeOptions" />
      <BaseSelect v-model="form.status" label="Tình trạng hiệu lực" placeholder="Tất cả" :options="statusOptions" />
      <div class="flex items-end gap-2">
        <BaseButton type="submit">Tìm kiếm</BaseButton>
        <BaseButton variant="secondary" @click="emit('reset')">Xóa bộ lọc</BaseButton>
      </div>
    </div>
  </form>
</template>