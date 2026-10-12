<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { authApi } from "@/services/api";
import { ApiError } from "@/services/http";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const router = useRouter();
const auth = useAuthStore();

const form = reactive({ fullName: "", email: "", password: "", confirmPassword: "" });
const errors = reactive({ fullName: "", email: "", password: "", confirmPassword: "" });
const submitError = ref("");
const loading = ref(false);

function validate() {
  errors.fullName = form.fullName.trim() ? "" : "Vui lòng nhập họ và tên.";
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? "" : "Vui lòng nhập email hợp lệ.";

  if (form.password.length < 8) {
    errors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
  } else if (new TextEncoder().encode(form.password).length > 72) {
    errors.password = "Mật khẩu quá dài (tối đa 72 byte).";
  } else {
    errors.password = "";
  }

  errors.confirmPassword = form.confirmPassword === form.password ? "" : "Mật khẩu nhập lại không khớp.";

  return !errors.fullName && !errors.email && !errors.password && !errors.confirmPassword;
}

async function submit() {
  submitError.value = "";
  if (!validate()) return;

  loading.value = true;
  try {
    await authApi.register({
      email: form.email.trim(),
      password: form.password,
      full_name: form.fullName.trim(),
    });
    // Đăng ký xong thì đăng nhập luôn cho tiện.
    await auth.login(form.email.trim(), form.password);
    router.push({ name: "home" });
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      submitError.value = "Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.";
    } else {
      submitError.value = err.message || "Đăng ký thất bại, vui lòng thử lại.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 class="text-2xl font-bold text-slate-900">Đăng ký tài khoản</h1>
      <p class="mt-1 text-sm text-slate-600">Tạo tài khoản để nhận thông báo về văn bản mới.</p>

      <form class="mt-6 space-y-4" novalidate @submit.prevent="submit">
        <p v-if="submitError" class="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {{ submitError }}
        </p>

        <BaseInput v-model="form.fullName" label="Họ và tên" autocomplete="name" required :error="errors.fullName" />
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
          autocomplete="new-password"
          required
          hint="Tối thiểu 8 ký tự."
          :error="errors.password"
        />
        <BaseInput
          v-model="form.confirmPassword"
          label="Nhập lại mật khẩu"
          type="password"
          autocomplete="new-password"
          required
          :error="errors.confirmPassword"
        />

        <BaseButton type="submit" block :loading="loading">Đăng ký</BaseButton>
      </form>

      <p class="mt-6 text-center text-sm text-slate-600">
        Đã có tài khoản?
        <RouterLink :to="{ name: 'login' }" class="font-semibold text-blue-700 hover:underline">Đăng nhập</RouterLink>
      </p>
    </div>
  </div>
</template>