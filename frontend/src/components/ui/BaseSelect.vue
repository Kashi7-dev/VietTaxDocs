<script setup>
import { useId } from "vue";

defineOptions({ inheritAttrs: false });

const model = defineModel({ type: [String, Number], default: "" });

defineProps({
  label: { type: String, default: "" },
  // [{ value: "TNCN", label: "Thuế thu nhập cá nhân" }, ...]
  options: { type: Array, default: () => [] },
  // Nếu có, thêm một lựa chọn đầu tiên với giá trị rỗng (nghĩa là "không lọc")
  placeholder: { type: String, default: "" },
});

const id = useId();
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="mb-1 block text-sm font-medium text-slate-700">
      {{ label }}
    </label>
    <select
      v-bind="$attrs"
      :id="id"
      v-model="model"
      class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>