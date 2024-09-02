import Axios from "axios";
import { API_SERVER } from "../config/constant";

const axios = Axios.create({
  baseURL: `${API_SERVER}`,
  headers: { "Content-Type": "application/json" },
});

axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse( localStorage.getItem('user') );
    if( user && user.token ) {
      config.headers['x-access-token'] = `${user.token}`;
    }
    return Promise.resolve(config);
  },
  (error) => {
    Promise.reject(error)
  }
);

axios.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
