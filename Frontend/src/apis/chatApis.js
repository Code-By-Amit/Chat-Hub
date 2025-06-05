import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
})

/* ========== 📨 Message APIs ========== */

export const sendMessageApi = (formdata, token) => api.post('/message/send', formdata, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data)

export const getMessagesApi = (reciverChatId,isGroupChat, token) =>{
    let url;
    if(isGroupChat){
        url = `/message/getmessage/?chatId=${reciverChatId}`
    }else{ url = `/message/getmessage/?toUserId=${reciverChatId}`}
   return api.get(url, { headers: { Authorization: `Bearer ${token}` } })
   .then(res => res.data.messages)
} 


/* ========== 👥 Friend Requests (Invitations) ========== */

export const fetchIncommingRequest = (token) => api.get('/invitation/incomming', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data)

export const fetchOutgoingRequest = (token) => api.get('/invitation/outgoing', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data)

export const acceptRequest = (requestId, token) => api.post('/invitation/accept', {requestId}, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data)  

export const declineRequest = (requestId, token) => api.post('/invitation/decline', {requestId}, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data)  

export const sendFriendRequest = (toUserId, token) => api.post('/invitation/send', {toUserId}, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data)  



/* ========== 👥 Group APIs ========== */

export const createGroupApi = (data,token) => api.post("/group/create",data,{headers:{Authorization: `Bearer ${token}` }}).then(res => res.data.createdGroup)  

export const getUserGroupApi = (token) => api.get("/group",{headers:{Authorization: `Bearer ${token}` }}).then(res => res.data.groups) 

export const inviteToGroup = (data,token) => api.post("/group/invite",data,{headers:{Authorization: `Bearer ${token}` }}).then(res => res.data)

export const acceptGroupInvitation = (invitaionId,token) => api.post(`/group/invitation/accept/${invitaionId}`,{},{headers:{Authorization: `Bearer ${token}` }}).then(res => res.data) 

export const leaveGroupApi = (groupId,token) => api.patch(`/group/leave/${groupId}`,{},{headers:{Authorization: `Bearer ${token}` }}).then(res => res.data) 


