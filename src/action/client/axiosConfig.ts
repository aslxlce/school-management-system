import axios from "axios";

const axiosConfig = axios.create({
    baseURL: "/api",
});

axiosConfig.interceptors.request.use((config) => {
    if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
    }

    return config;
});

export default axiosConfig;
