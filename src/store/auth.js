import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    friendCode: null
  }),

  actions: {
    async register(email, password) {
      await api.post("/auth/register", { email, password });
    },

    async login(email, password) {
      const res = await api.post("/auth/login", { email, password });

      this.token = res.data.token;
      this.friendCode = res.data.friendCode;

      localStorage.setItem("token", this.token);
    },

    logout() {
      this.token = null;
      localStorage.removeItem("token");
    }
  }
});