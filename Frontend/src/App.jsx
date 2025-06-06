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

function App() {

  const publicKey = "YourPublicVapidKeyHere"; // From step 1

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

async function subscribeToPush() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    });

    // Send subscription to your backend
    await fetch('/api/save-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription, userId: yourUserId })
    });
  }
}

useEffect(() => {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      subscribeToPush();
    }
  });
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
