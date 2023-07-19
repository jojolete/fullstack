import createAuthRefreshInterceptor from "axios-auth-refresh";
import { getAccessToken, getUser, getRefreshToken } from "../hooks/user.actions";
import axios from "axios";

const axiosService = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type":"application/json"
    },
});

axiosService.interceptors.request.use(async (config) =>{


    config.headers.Authorization = `Bearer ${getAccessToken()}`;
    return config;
})

axiosService.interceptors.response.use(
    (res) => Promise.resolve(res),
    (err) => Promise.reject(err)
);

const refreshAuthLogic = async (failedRequest) => {
    return axios.post("/api/auth/refresh/", 
        
        {
            refresh: getRefreshToken(),
            
        }, {
        baseURL:"http://localhost:8000",
        
    }).then((resp) =>{
        const access = resp.data;
        failedRequest.response.config.headers["Authorization"] = "Bearer " + access;
        localStorage.setItem("auth", JSON.stringify({
            access: access.access , refresh: getRefreshToken(), user: getUser()
        }));
    }).catch(()=>{
        localStorage.removeItem("auth");
    });
};

createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

export function fetcher(url) {
    return axiosService.get(url).then((res) => res.data);
}

export default axiosService;