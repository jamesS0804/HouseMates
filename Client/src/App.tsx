import './App.css'
import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import GetStartedPage from './Pages/GetStartedPage'
import EntryPage from './Pages/EntryPage'
import VerificationPage from './Pages/VerificationPage'
import HomePage from './Pages/HomePage'
import SignupPage from './Pages/SignupPage'
import LoginPage from './Pages/LoginPage'

export default function App() {
  const [ userType,setUserType ] = useState('Homeowner')

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
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/verification' element={<VerificationPage />}/>
        <Route path='/home' element={<HomePage />}/>
      </Routes>
    </div>
  )
}