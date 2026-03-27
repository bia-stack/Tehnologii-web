import axios from "axios"; //importa axios, o librarie ptr requsturi

const instance = axios.create({
    //VITE API URL ESTE NOUA ADRESA PTR AZURE, DACA RAMANEA 3000, EL NU AR
    //FI STIUT CA E LOCALHOST
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api", //seteaza url-ul backendului
    headers: {
        'Content-Type': 'application/json' //seteaza tipul de date
    }
});

//detecteaza requesturile si adauga token
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;