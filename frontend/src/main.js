import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router.js";
import './styles.css';
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App);

const options = {
    position: POSITION.TOP_CENTER,
    timeout: 5000
};
app.use(Toast, options);
app.use(router);

app.mount("#app");

export default app;
