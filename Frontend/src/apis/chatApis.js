import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
})

export const sendMessageApi = (reciverId, message, token) => api.post('/message/send', { reciverId, message }, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data)

export const getMessagesApi = (toUserId, token) => api.get(`/message/getmessage/${toUserId}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data)

export const fetchIncommingRequest = (token) => api.get('/friendrequest/incomming', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data)

export const acceptRequest = (requestId, token) => api.post('/friendrequest/accept', {requestId}, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data)  

export const declineRequest = (requestId, token) => api.post('/friendrequest/decline', {requestId}, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data)  