<script setup>
import { computed } from "vue";
import { STATUS_LABELS } from "@/utils/format";

const props = defineProps({
  status: { type: String, required: true },
});

const STYLES = {
  con_hieu_luc: "bg-green-50 text-green-700 ring-green-600/20",
  het_hieu_luc: "bg-slate-100 text-slate-600 ring-slate-500/20",
  sap_hieu_luc: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

const label = computed(() => STATUS_LABELS[props.status] || props.status);
const styleClass = computed(() => STYLES[props.status] || STYLES.het_hieu_luc);
</script>

<template>
  <span
    :class="['inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset', styleClass]"
  >
    {{ label }}
  </span>
</template>