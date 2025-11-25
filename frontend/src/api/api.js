// src/api/api.js
import axios from "axios";

export const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 30000,
});

// Do NOT attach token to public endpoints
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const publicEndpoints = ["/auth/login", "/auth/register"];

    // config.url may include query params, compare pathname
    const url = config.url || "";
    const isPublic = publicEndpoints.some((ep) => url.startsWith(ep));

    if (!isPublic && token) {
      if (!config.params) config.params = {};
      config.params.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
