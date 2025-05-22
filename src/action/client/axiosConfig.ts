import axios from "axios";

const axiosConfig = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});
export default axiosConfig;
