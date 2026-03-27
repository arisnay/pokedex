<template>
  <div class="teams-container">
    <h2>🛡️ Mis Equipos</h2>

    <div v-if="!teams.length" class="empty-state">
      <p>No tienes equipos guardados aún.</p>
      <button @click="$router.push('/team')" class="create-btn">Crear primer equipo</button>
    </div>

    <div v-else class="teams-grid">
      <div v-for="(team, index) in teams" :key="index" class="team-card">
        <h3>Equipo {{ index + 1 }}</h3>
        <div class="team-members">
          <div v-for="pokemon in team" :key="pokemon.name" class="pokemon-item">
            <span class="pokemon-name">{{ pokemon.name }}</span>
            <span class="pokemon-type" :style="{ backgroundColor: getTypeColor(pokemon.type) }">
              {{ pokemon.type }}
            </span>
          </div>
        </div>
        <div class="team-actions">
          <button @click="selectTeam(index)" class="select-btn">Seleccionar</button>
          <button @click="deleteTeam(index)" class="delete-btn">Eliminar</button>
        </div>
      </div>
    </div>

    <div class="actions">
      <button @click="$router.push('/team')" class="create-btn">Crear nuevo equipo</button>
      <button @click="$router.push('/battle')" class="battle-btn" :disabled="!selectedTeam">Ir a batalla</button>
      <button @click="$router.push('/')" class="back-btn">⬅ Volver</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { user, setUser } from '../store/user';

const teams = ref([]);
const selectedTeam = ref(null);

const getTypeColor = (type) => {
  const colors = {
    grass: '#8BD674',
    fire: '#FFA756',
    water: '#58ABF6',
    electric: '#F2CB55',
    rock: '#B69E31',
    psychic: '#FF6568',
    ground: '#D97745',
    fairy: '#EE99AC',
    normal: '#A8A77A',
    poison: '#A33EA1',
    flying: '#A98FF3',
    bug: '#A6B91A',
    ghost: '#735797',
    ice: '#96D9D6',
    fighting: '#C22E28',
    steel: '#B7B7CE',
    dragon: '#6F35FC'
  };
  return colors[type] || '#666';
};

const loadTeams = () => {
  const savedTeams = localStorage.getItem('userTeams');
  if (savedTeams) {
    teams.value = JSON.parse(savedTeams);
  }
};

const selectTeam = (index) => {
  selectedTeam.value = index;
  user.value.selectedTeam = teams.value[index];
  setUser(user.value);
  alert(`Equipo ${index + 1} seleccionado para batalla!`);
};

const deleteTeam = (index) => {
  if (confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
    teams.value.splice(index, 1);
    localStorage.setItem('userTeams', JSON.stringify(teams.value));

    // If this was the selected team, clear selection
    if (selectedTeam.value === index) {
      selectedTeam.value = null;
      user.value.selectedTeam = null;
      setUser(user.value);
    }
  }
};

onMounted(() => {
  loadTeams();
});
</script>

<style scoped>
.teams-container {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 50px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 30px;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.team-card {
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.team-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.team-members {
  margin: 15px 0;
}

.pokemon-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin: 5px 0;
  background: #f8f9fa;
  border-radius: 6px;
}

.pokemon-name {
  font-weight: bold;
  text-transform: capitalize;
}

.pokemon-type {
  padding: 2px 8px;
  border-radius: 12px;
  color: white;
  font-size: 0.8em;
  text-transform: capitalize;
}

.team-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.select-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
}

.delete-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  flex: 1;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.create-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.battle-btn {
  background: #FF9800;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.battle-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.back-btn {
  background: #9E9E9E;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}
</style>