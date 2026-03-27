<template>
  <div class="container">
    <h2>👥 Amigos de {{ user.name }}</h2>

    <div class="friend-form">
      <input v-model="code" placeholder="Código amigo" />
      <button @click="addFriend" :disabled="!code.trim()">Agregar</button>
    </div>

    <div v-if="user.friends && user.friends.length">
      <div 
        class="friend-card" 
        v-for="friend in user.friends" 
        :key="friend"
      >
        {{ friend }}

        <button @click="retador(friend)">
          ⚔️ Retar
        </button>
      </div>
    </div>

    <div v-else>
      <p>No tienes amigos 😢</p>
    </div>

    <button @click="$router.push('/')">
      ⬅ Volver
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { user, setUser } from "../store/user";

const code = ref("");

function addFriend() {
  const newFriend = code.value.trim();
  if (!newFriend) return;

  if (!user.value.friends) user.value.friends = [];
  if (!user.value.friends.includes(newFriend)) {
    user.value.friends.push(newFriend);
    setUser(user.value);
    alert(`Amigo ${newFriend} agregado 👍`);
  } else {
    alert(`El amigo ${newFriend} ya existe.`);
  }

  code.value = "";
}

async function retador(friend) {
  await fetch("http://localhost:3000/challenge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: user.value.name,
      to: friend
    })
  });

  alert(`Reto enviado a ${friend} ⚔️`);
}
</script>

<style scoped>
.container {
  padding: 30px;
  text-align: center;
}

.friend-card {
  background: #eee;
  padding: 15px;
  margin: 10px auto;
  border-radius: 10px;
  width: 250px;
}

.friend-form {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 18px;
}

.friend-form input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 180px;
}

.friend-form button {
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  background: #ffcb05;
  cursor: pointer;
}
</style>