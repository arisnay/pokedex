<template>
  <div class="app-shell">
    <header class="navbar">
      <div class="logo">📟 PokeDex - Classic</div>
      <nav>
        <router-link to="/">Inicio</router-link>
        <router-link to="/favorites">Favoritos</router-link>
        <router-link to="/battle">Batalla</router-link>
        <router-link to="/friends">Amigos</router-link>
      </nav>
    </header>

    <main class="container">
      <section class="search-area">
        <h1>Catálogo Pokémon</h1>
        <input v-model="search" placeholder="Busca por nombre..." />
        <select v-model="selectedType" class="type-filter">
          <option value="">Todos los tipos</option>
          <option v-for="type in availableTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </section>

      <section class="grid">
        <article
          v-for="p in filteredPokemons"
          :key="p.name"
          class="card"
          :style="{ '--type-color': typeColors[p.type] || '#666' }"
        >
          <img :src="p.image" :alt="p.name" />
          <div class="meta">
            <h3>{{ p.name }}</h3>
            <span class="type">{{ p.type }}</span>
          </div>
          <button @click="goDetail(p.name)">Ver detalle</button>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const pokemons = ref([]);
const search = ref("");
const selectedType = ref("");
const router = useRouter();

const typeColors = {
  grass: "#8BD674",
  fire: "#FFA756",
  water: "#58ABF6",
  electric: "#F2CB55",
  rock: "#B69E31",
  psychic: "#FF6568",
  ground: "#D97745",
  fairy: "#EE99AC",
  normal: "#A8A77A",
  poison: "#A33EA1",
  flying: "#A98FF3",
  bug: "#A6B91A",
  ghost: "#735797",
  ice: "#96D9D6",
  fighting: "#C22E28",
  steel: "#B7B7CE",
  dragon: "#6F35FC"
};

const filteredPokemons = computed(() => {
  const query = search.value.toLowerCase();
  const type = selectedType.value;
  return pokemons.value.filter((p) => {
    const matchesSearch = p.name.includes(query);
    const matchesType = !type || p.type === type;
    return matchesSearch && matchesType;
  });
});

const availableTypes = computed(() => {
  const types = new Set(pokemons.value.map(p => p.type));
  return Array.from(types).sort();
});

onMounted(async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=30");
  const data = await res.json();

  const detailed = await Promise.all(
    data.results.map(async (item) => {
      const detail = await fetch(item.url).then((r) => r.json());
      return {
        name: item.name,
        image: detail.sprites.other["official-artwork"].front_default || detail.sprites.front_default,
        type: detail.types[0]?.type.name || "normal"
      };
    })
  );

  pokemons.value = detailed;
});

const goDetail = (name) => {
  router.push(`/pokemon/${name}`);
};
</script>

<style scoped>
:root {
  --bg: #cdf0ea;
  --panel-bg: #e0eafc;
  --text: #1d3557;
  --card: #f8fafc;
  --shadow: rgba(27, 31, 35, 0.20);
}

.app-shell {
  background: linear-gradient(130deg, #b9fbc0, #a1def8, #fef9c7);
  min-height: 100vh;
  color: var(--text);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #20232a;
  color: #fff;
  padding: 12px 24px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
}

.navbar .logo {
  font-weight: bold;
  letter-spacing: 1px;
}

.navbar nav a {
  color: #f8f9fa;
  margin-left: 18px;
  text-decoration: none;
  font-weight: 600;
}

.navbar nav a:hover {
  color: #ffe066;
}

.container {
  padding: 24px;
}

.search-area {
  margin-bottom: 20px;
}

.search-area h1 {
  margin-bottom: 10px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.16);
}

.search-area input {
  width: 100%;
  max-width: 400px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 2px solid #334e68;
  outline: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.search-area input:focus {
  box-shadow: 0 0 0 3px rgba(2, 135, 193, 0.25);
  transform: translateY(-1px);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.card {
  background: radial-gradient(circle at 30% 30%, #ffffff 0%, #f5f8ff 55%, #e2e9ff 100%);
  border: 2px solid var(--type-color);
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 10px 25px var(--shadow);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.card img {
  width: 110px;
  height: 110px;
  object-fit: contain;
  margin-bottom: 10px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.25);
}

.meta {
  margin-bottom: 8px;
}

.meta h3 {
  text-transform: capitalize;
  margin: 0;
}

.type {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #aaa;
  font-size: 12px;
  margin-top: 4px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  background: #ffcb05;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>