import axios from "axios"
import { toast } from 'react-toastify';

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: 'http://localhost:3030'
});

instance.defaults.withCredentials = true
// co the set cookie tren

// // Alter defaults after instance has been created
// gan token cho header
instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("jwt")}`;


const handeleRefeshToken = () => {
    return instance
}

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    console.log(error)

    return Promise.reject(error);
    console.log(error)
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const status = error && error.response && error.response.status || 500;
    // console.log(status)
    switch (status) {
        // authentication (token related issues)
        case 401: {

            if (window.location.pathname !== "/" && window.location.pathname !== "/login" && window.location.pathname !== "/register") {
                toast.error("Unauthorized the user . please login")

            }
            // loi 401 khong can reject error ma tra thang ve error.response.data
            return error.response.data;
        }

        // forbidden (permission related issues)
        case 403: {
            toast.error("you don't have permission to access this page")

            return Promise.reject(error);
        }

        // bad request
        case 400: {
            return Promise.reject(error);
        }

        // not found
        case 404: {
            return Promise.reject(error);
        }

        // conflict
        case 409: {
            return Promise.reject(error);
        }

        // unprocessable
        case 422: {
            return Promise.reject(error);
        }
        case 429: {
            toast.error("Too many requests made from this ip , please try again  after 1 min")

            return Promise.reject(error);

        }

        // generic api error (server related) unexpected
        default: {
            return Promise.reject(error);
        }
    }
});

export default instance