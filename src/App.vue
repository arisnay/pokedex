<script setup>
async function activarNotificaciones() {
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    alert("Permiso denegado");
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: "TU_PUBLIC_KEY_AQUI"
  });

  await fetch("http://localhost:3000/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription)
  });

  alert("Notificaciones activadas 🎮");
}
</script>

<template>
  <div>
    <h1>🎮 Pokémon Game</h1>

    <!-- 🔥 ESTE ES EL MÁS IMPORTANTE -->
    <router-view />

    <br />

    <button @click="activarNotificaciones">
      🔔 Activar Notificaciones
    </button>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>