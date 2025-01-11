import { createApp } from "vue";
import App from "src/App.vue";
import { createPinia } from "pinia";
import router from "./routes";
import { useUserStore } from "./stores/userStore";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);

const userStore = useUserStore();

app.mount("#app");
