import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import Authorization from "@/components/Authorization.vue";
import PageHome from "@/views/PageHome.vue";
import { useUserStore } from "@/stores/userStore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const checkAuth = (to, from, next) => {
  const auth = getAuth();

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe();

    if (user) {
      if (to.path === "/auth") {
        next("/");
      } else {
        next();
      }
    } else {
      if (to.path !== "/auth") {
        next("/auth");
      } else {
        next();
      }
    }
  });
};

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: PageHome,
        beforeEnter: checkAuth,
      },
      {
        path: "/auth",
        name: "Auth",
        component: Authorization,
        // beforeEnter: checkAuth,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
