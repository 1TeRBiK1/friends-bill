import axios, { AxiosError, AxiosResponse } from "axios";

const { REACT_APP_URL_BE } = process.env;

const http = axios.create({
  baseURL: REACT_APP_URL_BE,
});

console.log(REACT_APP_URL_BE);

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
