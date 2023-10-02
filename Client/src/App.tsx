import './App.css'
import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import GetStartedPage from './Pages/GetStartedPage'
import EntryPage from './Pages/EntryPage'
import VerificationPage from './Pages/VerificationPage'
import HomePage from './Pages/HomePage'
import SignupPage from './Pages/SignupPage'
import LoginPage from './Pages/LoginPage'
import BookingsPage from './Pages/BookingsPage'
import MessagesPage from './Pages/MessagesPage'
import ProfilePage from './Pages/ProfilePage'
import ServiceMainPage from './Pages/ServiceMainPage'

export default function App() {
  const [ userType,setUserType ] = useState(()=> sessionStorage.getItem('userType') ? String(sessionStorage.getItem('userType')) : 'Homeowner')
  const [ selectedService, setSelectedService ] = useState("")
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
        <Route path='/home' element={<HomePage userType={userType} navigate={navigate} selectedService={selectedService} setSelectedService={setSelectedService} />}/>
        <Route path='/bookings' element={<BookingsPage userType={userType} navigate={navigate} />}/>
        <Route path='/messages' element={<MessagesPage userType={userType} navigate={navigate} />}/>
        <Route path='/profile' element={<ProfilePage />}/>
        <Route path='/services' element={<ServiceMainPage selectedService={selectedService} setSelectedService={setSelectedService} navigate={navigate}/>}/>
      </Routes>
    </div>
  )
}