import axios from 'axios';

const baseurl = process.env.REACT_APP_API_URL || '/';

const AxiosInstance = axios.create({
    baseURL: baseurl,
    timeout: 10000,
    headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json',
    },
});


// Adding an Axios interceptor
AxiosInstance.interceptors.response.use(
    response => response, // Pass through successful responses
    async error => {
        const config = error.config;
        if (!config._retry) {
            config._retry = true; // Mark request as retried
            return AxiosInstance(config); // Retry the request
        }
        return Promise.reject(error); // Reject if retry also fails
    }
);

export default AxiosInstance;
