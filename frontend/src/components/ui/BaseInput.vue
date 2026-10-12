<script setup>
import { computed, useId } from "vue";

// Các thuộc tính HTML thêm vào (type, placeholder, inputmode, autocomplete...)
// được chuyển thẳng vào thẻ <input> thay vì thẻ <div> bên ngoài.
defineOptions({ inheritAttrs: false });

const model = defineModel({ type: [String, Number], default: "" });

const props = defineProps({
  label: { type: String, default: "" },
  error: { type: String, default: "" },
  hint: { type: String, default: "" },
  required: { type: Boolean, default: false },
});

const id = useId();
const describedBy = computed(() => {
  if (props.error) return `${id}-error`;
  if (props.hint) return `${id}-hint`;
  return undefined;
});
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="mb-1 block text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-600" aria-hidden="true">*</span>
    </label>
    <input
      v-bind="$attrs"
      :id="id"
      v-model="model"
      :required="required"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="describedBy"
      :class="[
        'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2',
        error
          ? 'border-red-500 focus:ring-red-200'
          : 'border-slate-300 focus:border-blue-600 focus:ring-blue-200',
      ]"
    />
    <p v-if="error" :id="`${id}-error`" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-hint`" class="mt-1 text-sm text-slate-500">{{ hint }}</p>
  </div>
</template>