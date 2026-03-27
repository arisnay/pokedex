import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount("#app"); // 👈 SOLO UNA VEZ
createApp(App)
  .use(router)

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (!token && to.path !== "/login" && to.path !== "/register") {
    next("/login");
  } else {
    next();
  }
});


if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
    .then(() => console.log("SW registrado"))
    .catch(err => console.error(err));
}

/*if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registrado', reg))
      .catch(err => console.log('Error al registrar SW', err));
  });
}*/
