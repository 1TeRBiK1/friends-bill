import axios, { AxiosError, AxiosResponse } from "axios";

const http = axios.create({
  baseURL: "https://friends-bill-1f509f580179.herokuapp.com",
});

http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Обработка ошибки авторизации
    } else {
      // Обработка других ошибок
    }
    return Promise.reject(error);
  }
);

export default http;
