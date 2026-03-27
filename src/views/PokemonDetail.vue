<template>
  <div class="container" v-if="pokemon">
    <h1>{{ pokemon.name }}</h1>

    <img :src="pokemon.sprites.front_default" />

    <p>Altura: {{ pokemon.height }}</p>
    <p>Peso: {{ pokemon.weight }}</p>

    <button @click="addFavorite">❤️ Favorito</button>

    <div class="evolutions" v-if="evolutions.length > 0">
      <h2>Evoluciones</h2>
      <div class="evolution-list">
        <div v-for="evo in evolutions" :key="evo.id" class="evolution-item">
          <img :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`" :alt="evo.name" />
          <p>{{ evo.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";
import { useRoute } from "vue-router";
import { getPokemonEvolution, parseEvolution } from "../services/pokemon";

const route = useRoute();
const pokemon = ref(null);
const evolutions = ref([]);

onMounted(async () => {
  const res = await api.get(`/pokemon/${route.params.name}`);
  pokemon.value = res.data;

  // Load evolutions
  const evolutionData = await getPokemonEvolution(pokemon.value.id);
  evolutions.value = parseEvolution(evolutionData.chain || evolutionData);
});

const addFavorite = async () => {
  await api.post("/user/favorite", {
    pokemonId: pokemon.value.id
  });
};
</script>