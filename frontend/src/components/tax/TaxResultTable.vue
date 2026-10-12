<script setup>
import { computed } from "vue";
import { PERIOD_LABELS, formatPercent, formatVnd } from "@/utils/format";

const props = defineProps({
  // Kết quả trả về từ POST /tax-calculations
  result: { type: Object, required: true },
});

// Thuế suất bình quân = tổng thuế / thu nhập tính thuế (chỉ để tham khảo, tính ở giao diện)
const averageRate = computed(() => {
  if (!props.result.taxable_income) return 0;
  return (props.result.total_tax / props.result.taxable_income) * 100;
});
</script>

<template>
  <section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="result-heading">
    <h2 id="result-heading" class="text-lg font-bold text-slate-900">Kết quả tính thuế</h2>
    <p class="mt-1 text-sm text-slate-500">
      Năm tính thuế {{ result.year }} · {{ PERIOD_LABELS[result.period] || result.period }}
    </p>

    <dl class="mt-4 grid gap-3 sm:grid-cols-3">
      <div class="rounded-lg bg-slate-50 p-3">
        <dt class="text-xs font-medium uppercase text-slate-500">Thu nhập tính thuế</dt>
        <dd class="mt-1 text-lg font-semibold text-slate-900">{{ formatVnd(result.taxable_income) }}</dd>
      </div>
      <div class="rounded-lg bg-blue-50 p-3">
        <dt class="text-xs font-medium uppercase text-blue-700">Thuế phải nộp</dt>
        <dd class="mt-1 text-xl font-bold text-blue-800">{{ formatVnd(result.total_tax) }}</dd>
      </div>
      <div class="rounded-lg bg-slate-50 p-3">
        <dt class="text-xs font-medium uppercase text-slate-500">Thuế suất bình quân</dt>
        <dd class="mt-1 text-lg font-semibold text-slate-900">{{ formatPercent(averageRate) }}</dd>
      </div>
    </dl>

    <div v-if="result.breakdown.length > 0" class="mt-5 overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-200 text-sm">
        <caption class="sr-only">Chi tiết thuế theo từng bậc</caption>
        <thead>
          <tr class="text-left text-xs uppercase text-slate-500">
            <th scope="col" class="py-2 pr-4 font-semibold">Bậc</th>
            <th scope="col" class="py-2 pr-4 text-right font-semibold">Thu nhập trong bậc</th>
            <th scope="col" class="py-2 pr-4 text-right font-semibold">Thuế suất</th>
            <th scope="col" class="py-2 text-right font-semibold">Số thuế</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="row in result.breakdown" :key="row.bracket_order">
            <td class="py-2 pr-4 font-medium text-slate-900">Bậc {{ row.bracket_order }}</td>
            <td class="py-2 pr-4 text-right">{{ formatVnd(row.income_in_bracket) }}</td>
            <td class="py-2 pr-4 text-right">{{ formatPercent(row.tax_rate) }}</td>
            <td class="py-2 text-right font-medium text-slate-900">{{ formatVnd(row.tax_amount) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="mt-5 text-sm text-slate-600">Thu nhập tính thuế bằng 0 nên không phát sinh thuế.</p>

    <p v-if="result.legal_basis" class="mt-5 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
      <span class="font-semibold text-slate-700">Căn cứ pháp lý:</span> {{ result.legal_basis }}
    </p>
    <p class="mt-3 text-xs text-slate-500">
      Kết quả chỉ mang tính tham khảo. Hãy đối chiếu với văn bản gốc hoặc hỏi cơ quan thuế khi cần xác nhận.
    </p>
  </section>
</template>