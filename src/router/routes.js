import { createRouter, createWebHistory } from "vue-router";
import Authorization from "@/components/Authorization.vue";
import PageHome from "@/views/PageHome.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: PageHome,
  },
  {
    path: "/auth",
    name: "Auth",
    component: Authorization,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
