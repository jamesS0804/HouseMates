import './App.css'
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import GetStartedPage from './Pages/GetStartedPage'
import EntryPage from './Pages/EntryPage'
import VerificationPage from './Pages/VerificationPage'
import HomePage from './Pages/HomePage'
import SignupPage from './Pages/SignupPage'
import LoginPage from './Pages/LoginPage'
import BookingsPage from './Pages/BookingsPage'
import MessagesPage from './Pages/MessagesPage'
import ProfilePage from './Pages/ProfilePage'
import { useNavigate } from "react-router-dom";

export default function App() {
  const [ userType,setUserType ] = useState(()=> sessionStorage.getItem('userType') ? String(sessionStorage.getItem('userType')) : 'Homeowner')
  const navigate = useNavigate()
  return (
    <div className='h-screen'>
      <Routes>
        <Route index path='/' element={<GetStartedPage />}/>
        <Route path='/entry' element={
          <EntryPage userType={userType} setUserType={setUserType} />
        }/>
        <Route path='/signup' element={
          <SignupPage userType={userType} />
        }/>
        <Route path='/login' element={
          <LoginPage userType={userType} navigate={navigate} />
        }/>
        <Route path='/verification' element={
          <VerificationPage userType={userType} navigate={navigate} />
        }/>
        <Route path='/home' element={<HomePage userType={userType} navigate={navigate} />}/>
        <Route path='/bookings' element={<BookingsPage />}/>
        <Route path='/messages' element={<MessagesPage />}/>
        <Route path='/profile' element={<ProfilePage />}/>
      </Routes>
    </div>
  )
}