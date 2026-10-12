<script setup>
const year = new Date().getFullYear();
</script>

<template>
  <footer class="border-t border-slate-200 bg-white">
    <div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div class="grid gap-6 md:grid-cols-3">
        <div>
          <p class="text-base font-bold text-blue-800">VietTaxDocs</p>
          <p class="mt-2 text-sm text-slate-500">
            Thư viện văn bản pháp luật chuyên về thuế, kèm công cụ tính thuế thu nhập cá nhân.
          </p>
        </div>

        <div>
          <p class="text-sm font-semibold text-slate-900">Liên kết</p>
          <ul class="mt-2 space-y-1 text-sm">
            <li><RouterLink :to="{ name: 'documents' }" class="text-slate-600 hover:text-blue-700">Văn bản pháp luật</RouterLink></li>
            <li><RouterLink :to="{ name: 'tax-calculator' }" class="text-slate-600 hover:text-blue-700">Tính thuế TNCN</RouterLink></li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-semibold text-slate-900">Lưu ý</p>
          <p class="mt-2 text-sm text-slate-500">
            Thông tin chỉ mang tính tham khảo, không thay thế tư vấn pháp lý. Hãy luôn đối chiếu với văn bản gốc
            của cơ quan ban hành.
          </p>
        </div>
      </div>

      <p class="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500">
        © {{ year }} VietTaxDocs. Dự án cá nhân.
      </p>
    </div>
  </footer>
</template>