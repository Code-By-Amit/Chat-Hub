import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.181.232:3000",
    withCredentials: true
})

export const fetchAuthUser = (token) => api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data.user)

export const loginApi = (credential) => api.post("/auth/login", credential).then(res => res.data)

export const signupApi = (formData) => api.post("/auth/signup", formData).then(res => res.data)