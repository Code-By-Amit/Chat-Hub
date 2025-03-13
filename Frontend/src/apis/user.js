import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
})

export const fetchAuthUser = (token) => api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data.user)

export const loginApi = (credential) => api.post("/auth/login", credential).then(res => res.data)

export const signupApi = (formData) => api.post("/auth/signup", formData).then(res => res.data)

export const logoutApi = () => api.post("/auth/logout").then(res => res.data)

export const fetchUserFriends = (token) => api.get("/user/friends", { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data)

export const searchUserApi = (search, token) => api.get(`/user?search=${search}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data)

export const editUserProfileApi = (data, token) => api.patch(`/user/update`, data, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data)