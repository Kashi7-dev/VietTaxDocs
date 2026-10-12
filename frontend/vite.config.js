import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      // "@/..." trỏ tới thư mục src, ví dụ: import x from "@/services/api"
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    // Khi chạy local, mọi request bắt đầu bằng /api được chuyển tiếp sang backend (cổng 3000).
    // Nhờ vậy trình duyệt coi frontend và backend là cùng một nơi, không gặp lỗi CORS.
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});