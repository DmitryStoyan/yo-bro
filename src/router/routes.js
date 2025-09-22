import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import AuthPage from "@/pages/AuthPage.vue";
import PageHome from "@/views/PageHome.vue";
import UserProfilePage from "src/pages/UserProfilePage.vue";
import FriendsList from "src/components/FriendsList.vue";
import Notification from "src/components/Notification.vue";
import { useUserStore } from "@/stores/userStore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const checkAuth = (to, from, next) => {
  const auth = getAuth();

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe();

    if (user) {
      if (to.path === "/auth" || to.path === "/") {
        next("/friendsList");
      } else {
        next();
      }
    } else {
      if (to.path !== "/" && to.path !== "/auth") {
        next("/");
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
        // component: PageHome,
        component: AuthPage,
        beforeEnter: checkAuth,
      },
      {
        path: "/auth",
        name: "Auth",
        component: AuthPage,
        // beforeEnter: checkAuth,
      },
      {
        path: "/profile",
        name: "Profile",
        component: UserProfilePage,
        beforeEnter: checkAuth,
      },
      {
        path: "/friendsList",
        name: "FriendsList",
        component: FriendsList,
        beforeEnter: checkAuth,
      },
      {
        path: "/notification",
        name: "Notification",
        component: Notification,
        beforeEnter: checkAuth,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
