<template>
  <div class="battle-container">
    <header class="battle-header">
      <h2>⚔️ Batalla por equipos</h2>
      <div>
        <button @click="resetBattle" class="small-btn">Reiniciar</button>
        <router-link to="/team" class="small-btn">Equipo</router-link>
      </div>
    </header>

    <section class="team-selection">
      <div class="team-box">
        <h3>Tu equipo</h3>
        <ul>
          <li
            v-for="(p, idx) in playerTeam"
            :key="p.name + idx"
            :class="{ active: idx === playerIndex && activeSide === 'player', switching: idx === playerIndex && switching }"
          >
            {{ p.name }} ({{ p.type }}) - HP {{ p.hp }}/{{ p.maxHp }}
          </li>
        </ul>
      </div>

      <div class="team-box">
        <h3>Equipo enemigo</h3>
        <ul>
          <li
            v-for="(p, idx) in opponentTeam"
            :key="p.name + idx"
            :class="{ active: idx === opponentIndex && activeSide === 'opponent', switching: idx === opponentIndex && switching }"
          >
            {{ p.name }} ({{ p.type }}) - HP {{ p.hp }}/{{ p.maxHp }}
          </li>
        </ul>
      </div>
    </section>

    <section class="controls">
      <button @click="initTeamBattle" class="action-btn">Iniciar batalla por equipos</button>
      <button v-if="battleStarted && !winner" @click="nextRound" class="action-btn">Siguiente acción</button>
    </section>

    <section class="prompt" v-if="battleStarted && !winner">
      <p>{{ battlePrompt || `¡Adelante ${currentPlayer.name}!` }}</p>
    </section>

    <section class="status" v-if="battleStarted || winner">
      <p><strong>Turno:</strong> {{ activeSide === 'player' ? 'Tu equipo' : 'Enemigo' }}</p>
      <p><strong>Combate actual:</strong> {{ currentPlayer.name }} vs {{ currentOpponent.name }}</p>
      <p class="battle-log">{{ battleLog }}</p>
      <p v-if="winner" class="winner">🏆 Ganador: {{ winner }}</p>
    </section>

    <button @click="$router.push('/')" class="back-btn">⬅ Volver</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { user } from '../store/user';
import { loadUserTeam } from '../services/team';

const defaultOptions = [
  { name: 'Pikachu', type: 'electric', attack: 12, speed: 15, defense: 8 },
  { name: 'Bulbasaur', type: 'grass', attack: 10, speed: 9, defense: 12 },
  { name: 'Charmander', type: 'fire', attack: 13, speed: 11, defense: 8 },
  { name: 'Squirtle', type: 'water', attack: 9, speed: 8, defense: 14 },
  { name: 'Jigglypuff', type: 'normal', attack: 8, speed: 7, defense: 9 }
];

const effectiveness = {
  fire: { grass: 2, water: 0.5, electric: 1, fire: 0.5 },
  water: { fire: 2, grass: 0.5, electric: 1, water: 0.5 },
  grass: { water: 2, fire: 0.5, electric: 1, grass: 0.5 },
  electric: { water: 2, grass: 0.5, fire: 1, electric: 0.5 },
  normal: { rock: 0.5, ghost: 0, steel: 0.5 }
};

const playerTeam = ref([]);
const opponentTeam = ref([]);
const battleStarted = ref(false);
const activeSide = ref('player');
const playerIndex = ref(0);
const opponentIndex = ref(0);
const battleLog = ref('');
const winner = ref('');
const battlePrompt = ref('');
const switching = ref(false);

onMounted(async () => {
  const userTeam = user.value?.team || [];
  if (userTeam.length) {
    playerTeam.value = userTeam.map((p) => ({ ...p, hp: 100, maxHp: 100 }));
  } else if (user.value?.name) {
    const teamData = await loadUserTeam(user.value.name);
    if (teamData?.team) {
      playerTeam.value = teamData.team.map((p) => ({ ...p, hp: 100, maxHp: 100 }));
    }
  }
  if (!playerTeam.value.length) {
    playerTeam.value = defaultOptions.slice(0, 3).map((p) => ({ ...p, hp: 100, maxHp: 100 }));
  }

  opponentTeam.value = defaultOptions.slice(0, 3).map((p) => ({ ...p, hp: 100, maxHp: 100 }));
});

function getEffectiveness(attType, defType) {
  return effectiveness[attType]?.[defType] ?? 1;
}

function computeDamage(attacker, defender) {
  const eff = getEffectiveness(attacker.type, defender.type);
  const raw = Math.max(1, Math.round((attacker.attack - defender.defense * 0.25) * eff + Math.random() * 4));
  return { raw, eff };
}

const currentPlayer = computed(() => playerTeam.value[playerIndex.value] || {});
const currentOpponent = computed(() => opponentTeam.value[opponentIndex.value] || {});

watch([playerIndex, opponentIndex, activeSide], () => {
  switching.value = true;
  battlePrompt.value = `¡Adelante ${currentPlayer.value.name || 'Entrenador'}!`;
  setTimeout(() => {
    switching.value = false;
  }, 600);
});

function initTeamBattle() {
  playerTeam.value = playerTeam.value.map((p) => ({ ...p, hp: 100, maxHp: 100 }));
  opponentTeam.value = opponentTeam.value.map((p) => ({ ...p, hp: 100, maxHp: 100 }));
  battleStarted.value = true;
  playerIndex.value = 0;
  opponentIndex.value = 0;
  activeSide.value = playerTeam.value[0].speed >= opponentTeam.value[0].speed ? 'player' : 'opponent';
  battlePrompt.value = `¡Adelante ${playerTeam.value[0]?.name || 'Entrenador'}!`;
  switching.value = true;
  setTimeout(() => (switching.value = false), 600);
  battleLog.value = `Inicia la batalla: ${activeSide.value === 'player' ? 'tu equipo' : 'equipo enemigo'}.`;
  winner.value = '';
}

function nextRound() {
  if (!battleStarted.value || winner.value) return;

  const attacker = activeSide.value === 'player' ? currentPlayer.value : currentOpponent.value;
  const defender = activeSide.value === 'player' ? currentOpponent.value : currentPlayer.value;

  if (!attacker || !defender) return;

  const { raw, eff } = computeDamage(attacker, defender);
  defender.hp = Math.max(0, defender.hp - raw);

  battleLog.value = `${attacker.name} ataca a ${defender.name} con efecto x${eff}. Daño: ${raw}.`;

  if (defender.hp <= 0) {
    battleLog.value += `\n${defender.name} ha caído.`;
    if (activeSide.value === 'player') {
      opponentIndex.value += 1;
      battlePrompt.value = `¡Adelante ${playerTeam.value[playerIndex.value]?.name || 'Entrenador'}!`;
    } else {
      playerIndex.value += 1;
      battlePrompt.value = `¡Adelante ${opponentTeam.value[opponentIndex.value]?.name || 'Rival'}!`;
    }
    switching.value = true;
    setTimeout(() => (switching.value = false), 600);
  }

  const playerKnocked = playerIndex.value >= playerTeam.value.length;
  const opponentKnocked = opponentIndex.value >= opponentTeam.value.length;

  if (playerKnocked || opponentKnocked) {
    battleStarted.value = false;
    winner.value = playerKnocked ? 'Equipo Enemigo' : 'Tu equipo';
    return;
  }

  activeSide.value = activeSide.value === 'player' ? 'opponent' : 'player';
}

function resetBattle() {
  battleStarted.value = false;
  winner.value = '';
  battleLog.value = '';
  playerIndex.value = 0;
  opponentIndex.value = 0;
}
</script>

<style scoped>
.battle-container {
  max-width: 800px;
  margin: 16px auto;
  background: #fdf7e4;
  border: 2px solid #5d7790;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.18);
}

.battle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team-selection {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
}

.team-box {
  flex: 1;
  background: #fff;
  border: 1px solid #b0c4de;
  border-radius: 10px;
  padding: 10px;
}

.team-box ul {
  list-style: none;
  padding: 0;
}

.team-box li {
  margin: 6px 0;
}

.controls {
  margin-top: 14px;
}

.action-btn,
.back-btn,
.small-btn {
  padding: 8px 12px;
  margin-right: 8px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  background: #ffcb05;
  font-weight: bold;
}

.status {
  margin-top: 12px;
  background: #eef6ff;
  border: 1px solid #9cc4f1;
  border-radius: 8px;
  padding: 8px;
}

.battle-log {
  white-space: pre-wrap;
  min-height: 2rem;
}

.prompt {
  margin: 8px 0;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 8px;
  color: #856404;
  padding: 8px;
  font-weight: bold;
  text-align: center;
  animation: pop 0.35s ease;
}

.team-box li.active {
  background: #e6f7ff;
  border-color: #4dabf7;
  font-weight: 700;
}

.team-box li.switching {
  animation: switch-pokemon 0.5s ease;
}

@keyframes switch-pokemon {
  0% { transform: translateX(0) scale(1); opacity: 1; }
  25% { transform: translateX(-8px) scale(0.98); opacity: 0.8; }
  50% { transform: translateX(8px) scale(1.02); opacity: 0.9; }
  100% { transform: translateX(0) scale(1); opacity: 1; }
}

@keyframes pop {
  0% { transform: scale(0.94); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.winner {
  margin-top: 8px;
  font-size: 1.1em;
  color: #2d6a4f;
  font-weight: bold;
}
</style>
