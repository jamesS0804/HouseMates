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
import axios from 'axios'
import ServiceVariationsPage from './Pages/ServiceVariationsPage'
import BookingDetailsPage from './Pages/BookingDetailsPage'
import TrackingPage from './Pages/TrackingPage'

type User = {
  id: number,
  email: string,
  isVerified: string,
  userType: string,
  name: string,
  phoneNumber: string,
  addressAttributes: {
      addressLine1: string,
      barangay: string,
      city: string,
      province: string,
      zipCode: string
  }
}

type SelectedService = {
  id: number
  title: string
  price: number
  serviceName: string
  icon: string
  background: string
}

export default function App() {
  const storedSessionData = sessionStorage.getItem('userSessionData')
  const userSessionData = storedSessionData ? JSON.parse(storedSessionData) : {}
  const [ userType, setUserType ] = useState(() => userSessionData ? String(sessionStorage.getItem('userType')) : 'Homeowner')
  const [ selectedService, setSelectedService ] = useState<SelectedService>({
    id: 0,
    title: "",
    price: 0,
    serviceName: "",
    icon: "",
    background: ""
  })
  const navigate = useNavigate()
  const location = useLocation();
  const api = axios.create({
    baseURL: 'https://housemates-backend.onrender.com/'
  })
  const [ currentUser, setCurrentUser ] = useState<User>({
    id: userSessionData?.id || 0, 
    email: userSessionData?.email || "",
    isVerified: "",
    userType: "",
    name: "",
    phoneNumber: "",
    addressAttributes: {
        addressLine1: "",
        barangay: "",
        city: "",
        province: "",
        zipCode: ""
    } })
  const [ authKey, setAuthKey ] = useState(sessionStorage.getItem('authToken') ? sessionStorage.getItem('authToken') : "")
  const [ isVerified, setIsVerified ] = useState(()=>{
    return userSessionData?.isVerified ? userSessionData.isVerified : false
  })
  const [ serviceDetails, setServiceDetails ] = useState({service: {}, data: {}, totalCost: 0, date: "", time: { $H: "", $m: "" }})

  useEffect(()=>{
    if (authKey && userSessionData?.isVerified) getCurrentUserProfile()
  },[authKey])

  useEffect(() => {
    window.scrollTo(0, 0);
    setServiceDetails(serviceDetails)
  }, [location.pathname]);

  useEffect(()=> {
    if(!authKey) {
      navigate("/")
      return
    }
    authKey && isVerified ? navigate("/home") : navigate("/verification")
  }, [isVerified])

  const getCurrentUserProfile = async () => {
    try {
      const res = await api.get(`api/v1/profiles/${currentUser.id}`)
      const jsonResponse = res.data.data
      if(res.status === 200){
        setCurrentUser({ ...currentUser, 
          name: jsonResponse.name,
          phoneNumber: jsonResponse.phone_number,
          addressAttributes: {
              addressLine1: jsonResponse.address.address_line_1,
              barangay: jsonResponse.address.barangay,
              city: jsonResponse.address.city,
              province: jsonResponse.address.province,
              zipCode: jsonResponse.address.zip_code
          }
        })
      } else {
        console.log(res)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='h-screen'>
      <Routes>
        <Route index path='/' element={<GetStartedPage />} />
        <Route path='/entry' element={
          <EntryPage userType={userType} setUserType={setUserType} />
        } />
        <Route path='/signup' element={
          <SignupPage userType={userType} navigate={navigate} api={api} />
        } />
        <Route path='/login' element={
          <LoginPage userType={userType} navigate={navigate} api={api} setCurrentUser={setCurrentUser} setAuthKey={setAuthKey} setIsVerified={setIsVerified} />
        } />
        <Route path='/verification' element={
          <VerificationPage userType={userType} navigate={navigate} currentUser={currentUser} setCurrentUser={setCurrentUser} setIsVerified={setIsVerified} api={api} />
        } />
        <Route path='/home' element={<HomePage userType={userType} navigate={navigate} selectedService={selectedService} setSelectedService={setSelectedService} api={api} currentUser={currentUser} />} />
        <Route path='/bookings' element={<BookingsPage userType={userType} navigate={navigate} currentUser={currentUser} api={api} />} />
        <Route path='/messages' element={<MessagesPage userType={userType} navigate={navigate} />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/services' element={<ServiceMainPage selectedService={selectedService} setSelectedService={setSelectedService} navigate={navigate} serviceDetails={serviceDetails} setServiceDetails={setServiceDetails} />} />
        <Route path='/services/variations' element={<ServiceVariationsPage selectedService={selectedService} navigate={navigate} serviceDetails={serviceDetails} setServiceDetails={setServiceDetails} api={api} />} />
        <Route path='/bookingDetails' element={<BookingDetailsPage navigate={navigate} serviceDetails={serviceDetails} setServiceDetails={setServiceDetails} currentUser={currentUser} api={api} />} />
        <Route path='/tracking' element={<TrackingPage navigate={navigate} serviceDetails={serviceDetails} setSelectedService={setSelectedService} />} />
      </Routes>
    </div>
  )
}