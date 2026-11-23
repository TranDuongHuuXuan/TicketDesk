import { defineStore } from "pinia";
import api from "../services/api";

const ACCESS_TOKEN_KEY = "ticketdesk_access";
const REFRESH_TOKEN_KEY = "ticketdesk_refresh";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },

  actions: {
    async login(credentials) {
      const { data } = await api.post("/auth/login/", credentials);

      this.token = data.access;
      this.refreshToken = data.refresh;

      localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);

      await this.fetchUser();
      return this.user;
    },

    logout() {
      this.user = null;
      this.token = null;
      this.refreshToken = null;

      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    async fetchUser() {
      if (!this.token) {
        this.user = null;
        return null;
      }

      try {
        const { data } = await api.get("/auth/me/");
        this.user = data;
        return data;
      } catch (error) {
        this.logout();
        throw error;
      }
    },
  },
});