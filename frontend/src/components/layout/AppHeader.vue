<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import BaseButton from "@/components/ui/BaseButton.vue";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const menuOpen = ref(false);

const navLinks = computed(() => {
  const links = [
    { to: "/", label: "Trang chủ" },
    { to: "/documents", label: "Văn bản" },
    { to: "/tax-calculator", label: "Tính thuế TNCN" },
  ];
  if (auth.isLoggedIn) {
    links.push({ to: "/notifications", label: "Thông báo" });
  }
  return links;
});

// "/" chỉ sáng khi đúng trang chủ, các mục khác sáng cả ở trang con (ví dụ /documents/5).
function isActive(to) {
  return to === "/" ? route.path === "/" : route.path.startsWith(to);
}

function linkClass(to) {
  return isActive(to)
    ? "bg-blue-50 text-blue-800"
    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
}

function logout() {
  auth.logout();
  router.push({ name: "home" });
}

// Đóng menu di động mỗi khi chuyển trang.
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
  },
);
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
      <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2 text-lg font-bold text-blue-800">
        <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        VietTaxDocs
      </RouterLink>

      <nav class="hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="['rounded-lg px-3 py-2 text-sm font-medium transition', linkClass(link.to)]"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="hidden items-center gap-2 md:flex">
        <template v-if="auth.isLoggedIn">
          <span class="max-w-40 truncate text-sm text-slate-600">{{ auth.user ? auth.user.full_name : "" }}</span>
          <BaseButton variant="secondary" @click="logout">Đăng xuất</BaseButton>
        </template>
        <template v-else>
          <RouterLink :to="{ name: 'login' }" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Đăng nhập
          </RouterLink>
          <RouterLink :to="{ name: 'register' }" class="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
            Đăng ký
          </RouterLink>
        </template>
      </div>

      <button
        type="button"
        class="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        aria-controls="mobile-menu"
        aria-label="Mở menu"
        @click="menuOpen = !menuOpen"
      >
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>

    <div v-if="menuOpen" id="mobile-menu" class="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
      <nav class="flex flex-col gap-1" aria-label="Điều hướng di động">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="['rounded-lg px-3 py-2 text-sm font-medium', linkClass(link.to)]"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
      <div class="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3">
        <template v-if="auth.isLoggedIn">
          <p class="px-1 text-sm text-slate-600">{{ auth.user ? auth.user.full_name : "" }}</p>
          <BaseButton variant="secondary" block @click="logout">Đăng xuất</BaseButton>
        </template>
        <template v-else>
          <RouterLink :to="{ name: 'login' }" class="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700">
            Đăng nhập
          </RouterLink>
          <RouterLink :to="{ name: 'register' }" class="rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-semibold text-white">
            Đăng ký
          </RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>