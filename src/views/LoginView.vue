<template>
  <div class="auth-container">
    <div class="card">
      <h1 class="title">POKEDEX</h1>

      <!-- SWITCH LOGIN / REGISTER -->
      <div class="tabs">
        <button :class="{ active: isLogin }" @click="isLogin = true">
          Login
        </button>
        <button :class="{ active: !isLogin }" @click="isLogin = false">
          Registro
        </button>
      </div>

      <!-- FORM -->
      <form @submit.prevent="handleSubmit" class="form">
        <input
          v-model="email"
          type="email"
          placeholder="Correo"
          required
        />

        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          required
        />

        <input
          v-if="!isLogin"
          v-model="username"
          type="text"
          placeholder="Nombre de usuario"
          required
        />

        <button class="btn">
          {{ isLogin ? "Entrar" : "Registrarse" }}
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const router = useRouter();

const isLogin = ref(true);
const email = ref("");
const password = ref("");
const username = ref("");
const error = ref("");

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      const res = await api.post("/auth/login", {
        email: email.value,
        password: password.value
      });

      localStorage.setItem("token", res.data.token);
    } else {
      await api.post("/auth/register", {
        email: email.value,
        password: password.value,
        username: username.value
      });

      isLogin.value = true;
      error.value = "Cuenta creada, ahora inicia sesión";
      return;
    }

    router.push("/");
  } catch (err) {
    error.value = err.response?.data?.msg || "Error";
  }
};
</script>

<style scoped>
.auth-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #ff0000, #000);
  font-family: 'Press Start 2P', cursive;
}

.card {
  background: #111;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 0 20px #ff0000;
  width: 320px;
  text-align: center;
}

.title {
  color: #ffcc00;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  padding: 10px;
  background: #222;
  border: none;
  color: white;
  cursor: pointer;
}

.tabs .active {
  background: #ff0000;
}

.form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: none;
}

.btn {
  width: 100%;
  padding: 10px;
  background: #ffcc00;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
}

.btn:hover {
  background: #ffaa00;
}

.error {
  margin-top: 10px;
  color: #ff4444;
}
</style>