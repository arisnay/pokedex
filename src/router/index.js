import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/LoginView.vue";
import Register from "../views/Register.vue";
import Home from "../views/Home.vue";
import PokemonDetail from "../views/PokemonDetail.vue";
import FavoritesView from "../views/FavoritesView.vue";
import Battle from "../views/Battle.vue";
import Team from "../views/Team.vue";
import Friends from "../views/FriendsView.vue";

const routes = [
    { path: "/friends",component: Friends},
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/pokemon/:name", component: PokemonDetail },
  { path: "/favorites", component: FavoritesView },
  { path: "/battle", component: Battle },
  { path: "/team", component: Team }
];

export default createRouter({
  history: createWebHistory(),
  routes
});