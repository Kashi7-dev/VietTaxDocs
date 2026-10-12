import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { configureHttp } from "./services/http";
import { useAuthStore } from "./stores/auth";
import "./style.css";

const app = createApp(App);

// Pinia phải được cài trước router, vì router guard dùng store.
app.use(createPinia());
app.use(router);

// Nối lớp gọi API với store đăng nhập: http.js cần biết token hiện tại
// và phải làm gì khi server trả 401 (token hết hạn hoặc không hợp lệ).
const auth = useAuthStore();
configureHttp({
  tokenProvider: () => auth.token,
  unauthorizedHandler: () => {
    auth.logout();
    router.push({
      name: "login",
      query: { redirect: router.currentRoute.value.fullPath },
    });
  },
});

app.mount("#app");