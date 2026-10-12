import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});


// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// RESPONSE INTERCEPTOR
api.interceptors.response.use(
(response) => response,

async (error) => {
const originalRequest = error.config;


if (
  error.response?.status === 401 &&
  originalRequest &&
  !originalRequest._retry &&
  !originalRequest.url?.includes("/auth/refresh-token")
) {
  originalRequest._retry = true;

  try {
    const response = await api.post("/auth/refresh-token");

    const newAccessToken = response.data.accessToken;

    if (!newAccessToken) {
      throw new Error("Refresh response did not contain accessToken");
    }

    localStorage.setItem("accessToken", newAccessToken);

    originalRequest.headers.Authorization =
      `Bearer ${newAccessToken}`;

    return api(originalRequest);
  } catch (refreshError) {
    localStorage.removeItem("accessToken");
    return Promise.reject(refreshError);
  }
}

return Promise.reject(error);


}
);

export default api;