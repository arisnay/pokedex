# pokedex

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

---

## 🧾 Documentación del proyecto

### 1. Instalación

```sh
# clonar repo
git clone <URL_DEL_REPOSITORIO>
cd pokedex
npm install

# iniciar frontend
npm run dev
```

### 2. Tecnologías

- Vue 3
- Vite
- Pinia (state management)
- Vue Router
- Axios
- JavaScript moderno (ES2020+)
- CSS (scoped)

### 3. Endpoints (backend local)

El frontend usa la base API configurada en `src/services/api.js`:

```js
baseURL: 'http://localhost:3000/api'
```

Rutas esperadas:

- `GET /api/pokemons` → listado de Pokémon (o fallback PokeAPI)
- `GET /api/pokemons/:id` → detalle por ID
- (opcional) otros endpoints si extiendes el backend según necesidades

### 4. Uso de variables de entorno (.env)

Crea archivo raíz `.env` o `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

En `src/services/api.js` usa:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
```

Con esto puedes cambiar backend sin tocar el código fuente.

