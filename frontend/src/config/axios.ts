import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
})

api.interceptors.request.use((config) => {
    const token=localStorage.getItem('AUTH_TOKEN')
    //si el token existe, agregarlo al header de la solicitud
    if(token){
        config.headers.Authorization = `Bearer ${token}`;

    }
    //si el token no existe, retorna la configuración sin modificar
    return config
})

export default api;