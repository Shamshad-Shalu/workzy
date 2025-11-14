import { HOST } from "@/constants/apiRoutes";
import axios from "axios";


const baseURL = import.meta.env.MODE === "development" ? `${HOST}/api` :"/api";


const api = axios.create({
    baseURL,
    withCredentials: true,
});


export default api;