import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import TicketListView from "../views/TicketListView.vue";
import TicketDetailView from "../views/TicketDetailView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
    },
    {
      path: "/tickets/:id",
      name: "ticket-detail",
      component: TicketDetailView,
    },
    {
      path: "/",
      name: "tickets",
      component: TicketListView,
    },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (auth.token && !auth.user) {
    try {
      await auth.fetchUser();
    } catch {
      // fetchUser đã xóa token không hợp lệ.
    }
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: "tickets" };
  }
});

export default router;
