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
fetch.interceptors.request.use((configs) => {
    configs.url = configs.url+ `?version=${config.version}`
    if(configs.method === 'post') {
        // configs.data = qs.stringify({
        //     ...configs.data
        // })
        let t = qs.stringify({
            ...configs.data
        })
        let t1 = t + `&version=${config.version}`
        configs.data = t1
    }
    return configs;
},(error) =>{
    return Promise.reject(error);
});

fetch.interceptors.response.use((configs) => {
    return configs.data
},(error) =>{
    return Promise.reject(error);
});

export default fetch