import axios from "axios";

// const axiosConfig = axios.create({
//     baseURL: "/api",
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// export default axiosConfig;

const axiosConfig = axios.create({
    baseURL: "/api",
    // Do NOT set default 'Content-Type' header here!
    // We'll let Axios infer it based on request body type
});

axiosConfig.interceptors.request.use((config) => {
    // Only set JSON headers if the body is a plain object (not FormData)
    if (config.data && typeof config.data === "object" && !(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
    }

    return config;
});

export default axiosConfig;
