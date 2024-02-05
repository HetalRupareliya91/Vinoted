import axios from "axios";
import AppURL from "./AppURL";
import auth from "./AuthHelper";
const http = axios.create({
  baseURL: AppURL,
  timeout: 7000,
  headers: {
    Accept: "application/json",
    "Content-Type": "multipart/form-data",
  },
});

http.interceptors.request.use(async (config) => {
  if (
    typeof auth.isAuthenticated() !== "undefined" &&
    typeof auth.isAuthenticated().access_token !== "undefined"
  ) {
    const token = auth.isAuthenticated().access_token;
    config.headers.Authorization = token ? "Bearer " + token : "Bearer ";
  }

  return config;
});

http.interceptors.response.use(
  async function (response) {
    return { status: true, code: response.status, data: response.data };
  },
  function ({ response }) {
    if (
      typeof response !== "undefined" &&
      response.status === 401 &&
      response.config.url !== "auth/login"
    ) {
      auth.clearJWT();
      // window.location.href = "/";
      return { status: false, code: 401, message: "Unauthorized." };
    } else if (typeof response !== "undefined") {
      return { status: false, code: response.status, ...response.data };
    } else {
      return { status: false, code: 504, message: "Gateway Timeout." };
    }
  }
);

export default {
  get: async function (url, data) {
    return new Promise((resolve, reject) => {
      http
        .get(url, { params: data })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getSync: function (url, data) {
    return new Promise((resolve, reject) => {
      http
        .get(url, { params: data })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  post: async function (url, data) {
    return new Promise((resolve, reject) => {
      http
        .post(url, data)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  put: async function (url, data) {
    return new Promise((resolve, reject) => {
      http
        .put(url, data)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  delete: async function (url, data) {
    return new Promise((resolve, reject) => {
      http
        .delete(url, data)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  options: async function (url, data) {
    return new Promise((resolve, reject) => {
      http
        .options(url, data)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetch: (options) => http(options),
};
