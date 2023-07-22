import { useNavigate } from "react-router-dom";
import axiosService from "../helpers/axios";
import axios from "axios";


function useUserActions(){ 
    const navigate = useNavigate();
    const baseURL = process.env.REACT_APP_API_URL

    return { 
        login,
        register,
        logout,
        edit
    };

    function login(data){
        return axios
                    .post(`${baseURL}/auth/login/`, data)
                    .then((res)=> {
                        setUserData(res.data);
                        axiosService
                        .get(`${baseURL}/user/${res.data.user.id}`)
                        .then((res) => {
                            const auth = JSON.parse(localStorage.getItem("auth")) || null;
                            if (auth) {
                                let newAvatar = res.data.avatar
                                auth.user.avatar = newAvatar;
                                console.log(auth);
                                localStorage.setItem("auth", JSON.stringify({
                                    refresh: auth.refresh,
                                    access: auth.access,
                                    user: auth.user
                                    })
                                );
                            }
                        }).catch((err) =>{
                            console.log(err);
                        })
                    navigate("/");
                    });
    }

    function logout(){
        localStorage.removeItem("auth");
        navigate('/login');
    }

  // Edit the user
    function edit(data, userId) {
        return axiosService
        .patch(`${baseURL}/user/${userId}/`, data, {
            headers: {
            "content-type": "multipart/form-data",
            },
        })
        .then((res) => {
            // Registering the account in the store
            localStorage.setItem(
            "auth",
            JSON.stringify({
                access: getAccessToken(),
                refresh: getRefreshToken(),
                user: res.data,
            })
            );
        });
    }
    function register(data) {
        return axios.post(`${baseURL}/auth/register/`, data).then((res) => {
            // Registering the account and tokens in the store
            setUserData(res.data);
            navigate("/");
            });
        }
}   
    function getUser() {
            const auth = JSON.parse(localStorage.getItem("auth")) || null;
            if (auth) {
            return auth.user;
            } else {
            return null;
            }
    }
    function getAccessToken(){
        const auth = JSON.parse(localStorage.getItem("auth"));
        return auth.access;
    }

    function getRefreshToken(){
        const auth = JSON.parse(localStorage.getItem("auth"));
        return auth.refresh;
    }

    function setUserData(data) {
        localStorage.setItem("auth", JSON.stringify({
            access: data.access,
            refresh: data.refresh,
            user: data.user,
        })
        );
    }

export  {
    useUserActions,
    getUser,
    getAccessToken,
    getRefreshToken,
    setUserData,
}