<template>
  <div class="team-container">
    <h2>🛡️ Creación de Equipo</h2>
    <p>Máximo 6 Pokémon.</p>

    <section class="team-builder">
      <label for="pokemon-select">Selecciona Pokémon:</label>
      <select id="pokemon-select" v-model.number="selectedIndex">
        <option v-for="(p, index) in teamOptions" :key="p.name" :value="index">
          {{ p.name }} ({{ p.type }})
        </option>
      </select>
      <button @click="addToTeam" :disabled="team.length >= 6">Añadir</button>
    </section>

    <section class="team-preview">
      <h3>Equipo</h3>
      <div v-if="!team.length">Tu equipo está vacío.</div>
      <ul>
        <li v-for="(p, index) in team" :key="p.name + index">
          <strong>{{ p.name }}</strong> ({{ p.type }})
          <button @click="removeFromTeam(index)">x</button>
        </li>
      </ul>
    </section>

    <button @click="saveTeam" class="save-btn" :disabled="!team.length">Guardar equipo en backend</button>
    <p v-if="saveMessage">{{ saveMessage }}</p>

    <button @click="$router.push('/battle')" class="next-btn" :disabled="!team.length">Ir a batalla por equipos</button>
    <button @click="$router.push('/')" class="back-btn">⬅ Volver</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { user, setUser } from '../store/user';
import { saveUserTeam, loadUserTeam } from '../services/team';

const options = [
  { name: 'Pikachu', type: 'electric', attack: 12, speed: 15, defense: 8 },
  { name: 'Bulbasaur', type: 'grass', attack: 10, speed: 9, defense: 12 },
  { name: 'Charmander', type: 'fire', attack: 13, speed: 11, defense: 8 },
  { name: 'Squirtle', type: 'water', attack: 9, speed: 8, defense: 14 },
  { name: 'Jigglypuff', type: 'normal', attack: 8, speed: 7, defense: 9 },
  { name: 'Geodude', type: 'rock', attack: 11, speed: 5, defense: 15 },
  { name: 'Abra', type: 'psychic', attack: 12, speed: 12, defense: 7 }
];

const teamOptions = options;
const selectedIndex = ref(0);
const team = ref([]);
const saveMessage = ref('');

onMounted(async () => {
  const userTeam = user.value?.team || [];
  if (userTeam.length) {
    team.value = [...userTeam];
  } else if (user.value?.name) {
    const backend = await loadUserTeam(user.value.name);
    if (backend?.team) {
      team.value = backend.team;
      setUser({ ...user.value, team: backend.team });
    }
  }
});

function addToTeam() {
  if (team.value.length >= 6) return;
  const pokemon = teamOptions[selectedIndex.value];
  if (!team.value.some((p) => p.name === pokemon.name)) {
    team.value.push({ ...pokemon });
  }
}

function removeFromTeam(index) {
  team.value.splice(index, 1);
}

async function saveTeam() {
  if (!user.value?.name) {
    saveMessage.value = 'Inicia sesión para guardar.';
    return;
  }
  const data = await saveUserTeam(user.value.name, team.value);
  if (data) {
    saveMessage.value = 'Equipo guardado en backend con éxito.';
    setUser({ ...user.value, team: team.value });
  } else {
    saveMessage.value = 'Guardado local (backend no disponible).';
    setUser({ ...user.value, team: team.value });
  }
}
</script>

<style scoped>
.team-container {
  max-width: 640px;
  margin: 20px auto;
  background: #f5f7ff;
  border: 2px solid #2a2d82;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.team-builder,
.team-preview {
  margin-bottom: 16px;
}

.team-builder select,
.team-builder button,
.save-btn,
.next-btn,
.back-btn {
  margin-top: 8px;
}

.team-preview ul {
  list-style: none;
  padding: 0;
}

.team-preview li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  margin-bottom: 4px;
  border: 1px solid #c5c6e8;
  border-radius: 8px;
  background: #fff;
}

.team-preview button {
  background: #ff6b6b;
  border: none;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}

.save-btn,
.next-btn,
.back-btn {
  background: #ffcb05;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  margin-right: 6px;
}

.save-btn[disabled],
.next-btn[disabled] {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>