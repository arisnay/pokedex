import api from './api';

export async function saveUserTeam(userId, team) {
  try {
    const response = await api.post('/teams', { userId, team });
    return response.data;
  } catch (err) {
    console.warn('No se pudo guardar en backend, usando local', err.message);
    return null;
  }
}

export async function loadUserTeam(userId) {
  try {
    const response = await api.get(`/teams/${userId}`);
    return response.data;
  } catch (err) {
    console.warn('No se pudo cargar equipo desde backend', err.message);
    return null;
  }
}

export async function listTeams() {
  try {
    const response = await api.get('/teams');
    return response.data;
  } catch (err) {
    console.warn('No se pudo cargar lista de equipos desde backend', err.message);
    return [];
  }
}
