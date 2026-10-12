import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { authApi } from "@/services/api";

const STORAGE_KEY = "viettaxdocs_auth";

// Đọc phiên đăng nhập đã lưu, bỏ qua nếu đã hết hạn hoặc dữ liệu hỏng.
function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.token && saved.expiresAt > Date.now()) {
      return saved;
    }
  } catch {
    // dữ liệu hỏng: bỏ qua
  }
  localStorage.removeItem(STORAGE_KEY);
  return null;
}

export const useAuthStore = defineStore("auth", () => {
  const saved = loadSaved();

  const token = ref(saved ? saved.token : null);
  const user = ref(saved ? saved.user : null);
  const expiresAt = ref(saved ? saved.expiresAt : 0);

  const isLoggedIn = computed(() => Boolean(token.value));

  async function login(email, password) {
    const result = await authApi.login({ email, password });

    token.value = result.access_token;
    user.value = result.user_information;
    expiresAt.value = Date.now() + result.expires_in * 1000;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: token.value, user: user.value, expiresAt: expiresAt.value }),
    );
  }

  function logout() {
    token.value = null;
    user.value = null;
    expiresAt.value = 0;
    localStorage.removeItem(STORAGE_KEY);
  }

  return { token, user, isLoggedIn, login, logout };
});