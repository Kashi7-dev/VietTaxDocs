import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
      meta: { title: "Trang chủ" },
    },
    {
      path: "/documents",
      name: "documents",
      component: () => import("@/views/DocumentsView.vue"),
      meta: { title: "Văn bản pháp luật" },
    },
    {
      path: "/documents/:id",
      name: "document-detail",
      component: () => import("@/views/DocumentDetailView.vue"),
      props: true, // :id trong URL được truyền vào view dưới dạng prop "id"
      meta: { title: "Chi tiết văn bản" },
    },
    {
      path: "/tax-calculator",
      name: "tax-calculator",
      component: () => import("@/views/TaxCalculatorView.vue"),
      meta: { title: "Tính thuế thu nhập cá nhân" },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      meta: { title: "Đăng nhập", guestOnly: true },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/RegisterView.vue"),
      meta: { title: "Đăng ký", guestOnly: true },
    },
    {
      path: "/notifications",
      name: "notifications",
      component: () => import("@/views/NotificationsView.vue"),
      meta: { title: "Thông báo", requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/NotFoundView.vue"),
      meta: { title: "Không tìm thấy trang" },
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

// Trang cần đăng nhập mà chưa đăng nhập thì chuyển sang /login (nhớ trang định vào để quay lại).
// Trang chỉ dành cho khách (đăng nhập, đăng ký) mà đã đăng nhập thì về trang chủ.
router.beforeEach((to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: "login", query: { redirect: to.fullPath } };
  }
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return { name: "home" };
  }
  return true;
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | VietTaxDocs` : "VietTaxDocs";
});

export default router;