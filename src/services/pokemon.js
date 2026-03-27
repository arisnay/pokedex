import api from './api';

// Si tu backend define rutas, use /pokemons y /pokemons/:id
// Si aún no existe, el fallback usa PokeAPI
const EXTERNAL_API = 'https://pokeapi.co/api/v2/pokemon?limit=50';

export async function getPokemons() {
  try {
    const response = await api.get('/pokemons');
    return response.data;
  } catch (err) {
    console.warn('Backend API no disponible, fallback a PokeAPI', err.message);
    const res = await fetch(EXTERNAL_API);
    const data = await res.json();
    return data.results;
  }
}

export async function getPokemonEvolution(id) {
  try {
    const response = await api.get(`/pokemon/evolution/${id}`);
    return response.data;
  } catch (err) {
    console.warn('Backend evolution no disponible, fallback a PokeAPI', err.message);
    // Fallback to PokeAPI evolution chain
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const species = await speciesRes.json();
    const evolutionRes = await fetch(species.evolution_chain.url);
    return await evolutionRes.json();
  }
}

export function parseEvolution(chain) {
  const evolutions = [];
  let current = chain;

  while (current) {
    evolutions.push({
      name: current.species.name,
      id: current.species.url.split('/').slice(-2, -1)[0] // Extract ID from URL
    });
    current = current.evolves_to.length > 0 ? current.evolves_to[0] : null;
  }

  return evolutions;
}
