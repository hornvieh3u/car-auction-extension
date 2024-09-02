import axios from "./index";

class UserApi {
    static getAll = (data) => {
        return axios.get(`${base}/all`);
    };

    static createOne = (data) => {
        return axios.post(`${base}/create`, data);
    };

    static delete = (data) => {
        return axios.post(`${base}/delete/`, data);
    };

    static update = (data) => {
        return axios.post(`${base}/update/#id`, data);
    };
}

let base = "admin/user";

export default UserApi;