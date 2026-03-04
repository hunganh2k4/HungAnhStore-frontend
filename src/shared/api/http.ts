import axios from 'axios';
import { tokenStore } from './token.store';

const BASE_URL = 'http://localhost:4000';

export const publicApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // gửi cookie
});

export const privateApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach access token
privateApi.interceptors.request.use((config) => {
  const token = tokenStore.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ===== AUTO REFRESH QUEUE =====
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization =
              `Bearer ${token}`;
            return privateApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await publicApi.post('/auth/refresh');

        tokenStore.set(data.accessToken);

        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;

        return privateApi(originalRequest);
      } catch (err) {
        processQueue(err, null);
        tokenStore.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);