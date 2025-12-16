// src/api/apiClient.js
import axios from "axios";

// ✅ لازم يكون شامل /api
const BASE_URL = (
  process.env.REACT_APP_API_BASE_URL || "https://fyp-x3m9.onrender.com/api"
).replace(/\/$/, "");

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    config.headers = config.headers || {};
    if (token) config.headers.Authorization = `Bearer ${token}`;
    else delete config.headers.Authorization;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error?.config || {};

    const isTimeout =
      error?.code === "ECONNABORTED" ||
      String(error?.message || "").toLowerCase().includes("timeout");

    const isNetworkError =
      !error?.response &&
      (String(error?.message || "").includes("Network Error") ||
        String(error?.message || "").includes("ERR_NETWORK"));

    // ✅ retry مرة وحدة فقط (Render sleep)
    if ((isTimeout || isNetworkError) && !config.__isRetryRequest) {
      config.__isRetryRequest = true;
      await new Promise((r) => setTimeout(r, 1200));
      config.timeout = 45000;
      return apiClient(config);
    }

    const status = error?.response?.status;
    const data = error?.response?.data;
    const msg = data?.message || data?.error || error?.message || "Request failed";

    const err = new Error(msg);
    err.status = status;
    err.data = data;
    return Promise.reject(err);
  }
);

export default apiClient;
