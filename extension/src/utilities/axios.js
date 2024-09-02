import Axios from "axios";
import { config } from "../config";
import { getToken } from "./store";

const axios = Axios.create({
  baseURL: `${config.API_URL}`,
  headers: { "Content-Type": "application/json" },
});

axios.interceptors.request.use(
  (config) => {
    let token = getToken();
    if( token ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return Promise.resolve(config);
  },
  (error) => {
    console.log('request: ', error)
    Promise.reject(error)
  }
);

axios.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => {
    console.log('response: ', error)
    return Promise.reject(error);
  }
);

export default axios;