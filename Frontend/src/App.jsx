import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/Signup'
import { MainLayout } from './components/Layout/MainLayout'
import { ChatPage } from './pages/ChatPage/ChatPage'
import { FriendRequest } from './pages/FriendRequest'
import { ProfilePage } from './pages/ProfilePage'
import { ProfileEdit } from './pages/ProfileEdit'
import { Login } from './pages/Login'
import { ProtectedRoute } from './ProtectedRoute'
import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { messageSubscriptionApi } from './apis/user'

function App() {

  const publicKey = "BNbLC38dQI4Fvcx3z-dH4469ckwMVVSbGkDylhdhWAmLQ8xSUkjH0Y-ExmmmAnDKckDonq82MvjCNEcMJZ2WW2s";
  const token = localStorage.getItem('token')

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }

  const subscribeMutation = useMutation({
    mutationKey:['messagePushSubscription'],
    mutationFn:(subscription) => messageSubscriptionApi(subscription,token),
    onSuccess:(data)=>{
        console.log("Data Recived from backednd: ",data)
    }
  })

  async function subscribeToPush() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // Send subscription to your backend
      if(token){
        subscribeMutation.mutate(subscription)
      }
    }
  }

  useEffect(() => {
  if ('Notification' in window && navigator.serviceWorker) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        // Now you can subscribe for push notifications here
        subscribeToPush();
      } else {
        console.log('Notification permission denied.');
      }
    });
  }
}, []);


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/chat' element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path='' element={<ChatPage />} />
          <Route path='friendrequest' element={<FriendRequest />} />
          <Route path='profile' element={<ProfilePage />} />
          <Route path='profile/edit' element={<ProfileEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
