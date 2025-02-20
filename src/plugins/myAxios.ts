import axios, { type AxiosInstance } from "axios";


const myAxios:AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api'
});

myAxios.defaults.withCredentials = true; // 配置为true

myAxios.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});


myAxios.interceptors.response.use(function (response) {
    // 未登录则跳转到登录页
    if (response?.data?.code === 40100) {
        const redirectUrl = window.location.href;
        window.location.href = `/user/login?redirect=${redirectUrl}`;
    }
    return response.data;
}, function (error) {
    return Promise.reject(error);
});

export default myAxios;
