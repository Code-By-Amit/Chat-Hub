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

function App() {

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
