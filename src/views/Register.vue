<template>
  <div class="container">
    <h1>Registro</h1>

    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />

    <button @click="register">Crear cuenta</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

console.log(req.body);
const email = ref("");
const password = ref("");

const auth = useAuthStore();
const router = useRouter();

const register = async () => {
  await auth.register(email.value, password.value);
  router.push("/login");
};
</script>