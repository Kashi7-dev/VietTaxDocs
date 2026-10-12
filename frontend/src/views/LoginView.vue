<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { ApiError } from "@/services/http";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const form = reactive({ email: "", password: "" });
const errors = reactive({ email: "", password: "" });
const submitError = ref("");
const loading = ref(false);

function validate() {
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? "" : "Vui lòng nhập email hợp lệ.";
  errors.password = form.password ? "" : "Vui lòng nhập mật khẩu.";
  return !errors.email && !errors.password;
}

// Chỉ chuyển hướng tới đường dẫn nội bộ của trang web (chống chuyển hướng sang trang lạ).
function redirectTarget() {
  const target = route.query.redirect;
  return typeof target === "string" && target.startsWith("/") && !target.startsWith("//") ? target : "/";
}

async function submit() {
  submitError.value = "";
  if (!validate()) return;

  loading.value = true;
  try {
    await auth.login(form.email.trim(), form.password);
    router.push(redirectTarget());
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      submitError.value = "Email hoặc mật khẩu không đúng.";
    } else {
      submitError.value = err.message || "Đăng nhập thất bại, vui lòng thử lại.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 class="text-2xl font-bold text-slate-900">Đăng nhập</h1>
      <p class="mt-1 text-sm text-slate-600">Đăng nhập để xem thông báo về văn bản mới.</p>

      <form class="mt-6 space-y-4" novalidate @submit.prevent="submit">
        <p v-if="submitError" class="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {{ submitError }}
        </p>

        <BaseInput
          v-model="form.email"
          label="Email"
          type="email"
          autocomplete="email"
          required
          :error="errors.email"
        />
        <BaseInput
          v-model="form.password"
          label="Mật khẩu"
          type="password"
          autocomplete="current-password"
          required
          :error="errors.password"
        />

        <BaseButton type="submit" block :loading="loading">Đăng nhập</BaseButton>
      </form>

      <p class="mt-6 text-center text-sm text-slate-600">
        Chưa có tài khoản?
        <RouterLink :to="{ name: 'register' }" class="font-semibold text-blue-700 hover:underline">Đăng ký</RouterLink>
      </p>
    </div>
  </div>
</template>