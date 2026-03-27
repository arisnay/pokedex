<template>
  <div class="container">
    <h2>⭐ Favoritos</h2>

    <div v-if="loading">Cargando favoritos...</div>
    <div v-if="error" class="error">Error: {{ error }}</div>

    <ul v-if="!loading && !error && favorites.length">
      <li v-for="poke in favorites" :key="poke.name || poke.id">
        {{ poke.name || poke.title || poke }}
      </li>
    </ul>

    <div v-if="!loading && !error && !favorites.length">
      No hay Pokémon favoritos aún.
    </div>

    <button @click="$router.push('/')">⬅ Volver</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import { user } from "../store/user";

const favorites = ref([]);
const loading = ref(false);
const error = ref(null);

function normalizeFavoriteItem(item) {
  if (typeof item === "string") return { name: item };
  if (item && item.name) return item;
  if (item && item.title) return { name: item.title };
  return { name: JSON.stringify(item) };
}

async function loadFavorites() {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.get("/user/favorites");

    if (Array.isArray(response.data) && response.data.length) {
      favorites.value = response.data.map(normalizeFavoriteItem);
    } else if (user.value && Array.isArray(user.value.favorites)) {
      favorites.value = user.value.favorites.map((item) => normalizeFavoriteItem(item));
    } else {
      favorites.value = [];
    }
  } catch (err) {
    console.warn("No se pudo cargar favorites desde backend, fallback local", err.message);

    if (user.value && Array.isArray(user.value.favorites)) {
      favorites.value = user.value.favorites.map((item) => normalizeFavoriteItem(item));
    } else {
      favorites.value = [];
    }

    // Mantener el error visible si no hay datos
    if (!favorites.value.length) {
      error.value = err.response?.data?.message || err.message || "Error al cargar favoritos";
    }
  } finally {
    loading.value = false;
  }
}

onMounted(loadFavorites);
</script>

<style scoped>
.container {
  padding: 24px;
}

.error {
  color: red;
  margin-bottom: 16px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

button {
  margin-top: 16px;
  padding: 10px 18px;
  border: none;
  background: #ffcb05;
  border-radius: 8px;
  cursor: pointer;
}
</style>
