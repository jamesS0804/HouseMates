import './App.css'
import { Routes, Route } from 'react-router-dom'
import GetStartedPage from './Pages/GetStartedPage'
import EntryPage from './Pages/EntryPage'
import VerificationPage from './Pages/VerificationPage'
import HomePage from './Pages/HomePage'

export default function App() {
  return (
    <div className='bg-background h-screen'>
      <Routes>
        <Route index path='/' element={<GetStartedPage />}/>
        <Route path='/entry' element={<EntryPage />}/>
        <Route path='/verification' element={<VerificationPage />}/>
        <Route path='/home' element={<HomePage />}/>
      </Routes>
    </div>
  )
}