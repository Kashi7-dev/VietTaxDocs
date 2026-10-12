<script setup>
import { computed, reactive } from "vue";
import { taxCalculationsApi } from "@/services/api";
import { useAsync } from "@/composables/useAsync";
import { formatVnd } from "@/utils/format";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ErrorAlert from "@/components/ui/ErrorAlert.vue";
import TaxResultTable from "@/components/tax/TaxResultTable.vue";

const currentYear = new Date().getFullYear();

const form = reactive({
  income: "",
  deductions: "0",
  period: "monthly",
  year: String(currentYear),
});

const errors = reactive({ income: "", deductions: "", year: "" });

const periodOptions = [
  { value: "monthly", label: "Theo tháng" },
  { value: "yearly", label: "Theo năm" },
];

const { data: result, loading, error, run } = useAsync((payload) => taxCalculationsApi.calculate(payload));

// Cho phép gõ "40.000.000" hoặc "40,000,000": bỏ dấu chấm, phẩy, khoảng trắng.
// Trả về null nếu để trống, NaN nếu không phải số nguyên không âm.
function parseAmount(text) {
  const cleaned = String(text).replace(/[.,\s]/g, "");
  if (cleaned === "") return null;
  if (!/^\d+$/.test(cleaned)) return Number.NaN;
  return Number(cleaned);
}

function amountPreview(text) {
  const value = parseAmount(text);
  return value === null || Number.isNaN(value) ? "" : `= ${formatVnd(value)}`;
}

const incomeHint = computed(() => amountPreview(form.income) || "Thu nhập tính thuế trong kỳ, chưa trừ giảm trừ.");
const deductionsHint = computed(
  () =>
    amountPreview(form.deductions) ||
    "Tổng giảm trừ bản thân, người phụ thuộc, bảo hiểm bắt buộc... trong cùng kỳ.",
);

// Kiểm tra dữ liệu nhập; hợp lệ thì trả về payload gửi lên API, ngược lại trả null.
function validate() {
  errors.income = "";
  errors.deductions = "";
  errors.year = "";

  const income = parseAmount(form.income);
  const deductions = parseAmount(form.deductions);
  const year = Number(form.year);

  if (income === null) errors.income = "Vui lòng nhập thu nhập.";
  else if (Number.isNaN(income)) errors.income = "Thu nhập phải là số nguyên không âm.";

  if (Number.isNaN(deductions)) errors.deductions = "Giảm trừ phải là số nguyên không âm.";

  if (!Number.isInteger(year) || year < 2009 || year > 2100) {
    errors.year = "Năm tính thuế phải từ 2009 đến 2100.";
  }

  if (errors.income || errors.deductions || errors.year) return null;

  return {
    income,
    deductions: deductions === null ? 0 : deductions,
    period: form.period,
    year,
  };
}

async function submit() {
  const payload = validate();
  if (payload) {
    await run(payload);
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">Tính thuế thu nhập cá nhân</h1>
      <p class="mt-1 text-slate-600">Áp dụng cho thu nhập từ tiền lương, tiền công của cá nhân cư trú.</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-5">
      <form
        class="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2"
        novalidate
        @submit.prevent="submit"
      >
        <BaseSelect v-model="form.period" label="Kỳ tính" :options="periodOptions" />

        <BaseInput
          v-model="form.income"
          label="Thu nhập (VND)"
          required
          inputmode="numeric"
          placeholder="Ví dụ: 40.000.000"
          :error="errors.income"
          :hint="incomeHint"
        />

        <BaseInput
          v-model="form.deductions"
          label="Các khoản giảm trừ (VND)"
          inputmode="numeric"
          placeholder="Ví dụ: 15.500.000"
          :error="errors.deductions"
          :hint="deductionsHint"
        />

        <BaseInput
          v-model="form.year"
          label="Năm tính thuế"
          type="number"
          inputmode="numeric"
          min="2009"
          max="2100"
          :error="errors.year"
          hint="Dùng để chọn biểu thuế có hiệu lực trong năm đó."
        />

        <BaseButton type="submit" block :loading="loading">Tính thuế</BaseButton>
      </form>

      <div class="space-y-4 lg:col-span-3">
        <ErrorAlert v-if="error" :message="error.message" />
        <TaxResultTable v-else-if="result" :result="result" />
        <div v-else class="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          <p class="font-semibold text-slate-900">Kết quả sẽ hiển thị ở đây.</p>
          <ul class="mt-3 list-disc space-y-1 pl-5">
            <li>Nhập thu nhập và tổng các khoản giảm trừ rồi bấm "Tính thuế".</li>
            <li>Chọn "Theo năm" nếu số liệu nhập là của cả năm.</li>
            <li>Công cụ chưa tính thu nhập từ kinh doanh hay cá nhân không cư trú.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>