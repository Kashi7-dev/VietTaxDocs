<script setup>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-700">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-blue-800"
    >
      Bỏ qua điều hướng
    </a>

    <AppHeader />

    <main id="main" class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>