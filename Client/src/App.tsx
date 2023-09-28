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

export default function App() {
  const [ userType,setUserType ] = useState(()=> sessionStorage.getItem('userType') ? String(sessionStorage.getItem('userType')) : 'Homeowner')

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
          <LoginPage userType={userType} />
        }/>
        <Route path='/verification' element={
          <VerificationPage userType={userType} />
        }/>
        <Route path='/home' element={<HomePage />}/>
        <Route path='/bookings' element={<BookingsPage />}/>
        <Route path='/messages' element={<MessagesPage />}/>
        <Route path='/profile' element={<ProfilePage />}/>
      </Routes>
    </div>
  )
}