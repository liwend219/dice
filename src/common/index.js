import axios from 'axios'
import config from './ev'
import qs from  'qs'
const fetch = axios.create({
    baseURL:config.http,
    method: 'post',
    timeout: 10000,
    // withCredentials: true,
    contentType: "application/json",
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
});
fetch.interceptors.request.use((config) => {
    if(config.method === 'post') {
        config.data = qs.stringify({
            ...config.data
        })
    } 
    return config;
},(error) =>{
    return Promise.reject(error);
});

fetch.interceptors.response.use((config) => {
    return config.data
},(error) =>{
    return Promise.reject(error);
});

export default fetch