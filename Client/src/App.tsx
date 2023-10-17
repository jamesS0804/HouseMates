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
import authenticated_api from './utils/authenticated_api'
import LoadingPage from './Pages/LoadingPage'
import AlertNotification from './Main Components/AlertNotification'
import AlertDialog from './Main Components/AlertDialog'

type User = {
  id: number,
  email: string,
  isVerified: string,
  userType: string,
  name: string,
  balance: number,
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
  const [ userSessionData, setUserSessionData ] = useState(()=>{
    const storedSessionData = sessionStorage.getItem('userSessionData')
    const parsedData = storedSessionData ? JSON.parse(storedSessionData) : {}
    return parsedData
  })
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
    isVerified: userSessionData?.isVerified || "",
    userType: userSessionData?.userType || "",
    name: "",
    balance: 0,
    phoneNumber: "",
    addressAttributes: {
        addressLine1: "",
        barangay: "",
        city: "",
        province: "",
        zipCode: ""
    } })
  const [ authKey, setAuthKey ] = useState(sessionStorage.getItem('authToken') ? sessionStorage.getItem('authToken') : "")
  const [ serviceDetails, setServiceDetails ] = useState({service: {}, data: {}, totalCost: 0, date: "", time: { $H: "", $m: "" }})
  const [ trackedBooking, setTrackedBooking ] = useState({})
  const [ pageIsLoading, setPageIsLoading ] = useState(false)
  const [ alert, setAlert ] = useState({ status: "", message: "" })
  const [ actionIsLoading, setActionIsLoading ] = useState(false)
  const [ show, setShow ] = useState(false)

  useEffect(()=>{
    sessionStorage.setItem("userSessionData", JSON.stringify(userSessionData))
  },[userSessionData])

  useEffect(()=>{
    setUserSessionData(userSessionData)
  },[userSessionData.isVerified][userSessionData.userType])

  useEffect(()=>{
    checkSessionExpiry()
    if (authKey && userSessionData?.isVerified === true) getCurrentUserProfile()
  },[])

  useEffect(() => {
    checkSessionExpiry()
    window.scrollTo(0, 0);
    setServiceDetails(serviceDetails)
    if(location.pathname === "/home") setAlert({ status: '', message: '' })
    if(location.pathname === "/home" && currentUser.balance === undefined ) getCurrentUserProfile()
  }, [location.pathname]);

  useEffect(()=> {
    if(!authKey) {
      navigate("/")
      return
    }
    authKey && userSessionData.isVerified === true ? navigate("/home") : navigate("/verification")
  }, [userSessionData.isVerified])

  const checkSessionExpiry = () => {
    const expiry = sessionStorage.getItem('expiry')
    const currentTimeInMilliseconds = new Date().getTime();
    const expiryInMilliseconds = parseInt(String(expiry),10) * 1000;
    const millisecondsTillSessionExpires = expiryInMilliseconds - currentTimeInMilliseconds;
    const minutesTillSessionExpires = millisecondsTillSessionExpires / 60000;
    console.log(minutesTillSessionExpires)
    if(minutesTillSessionExpires <= 0) {
      console.log("Session expired.")
      setShow(true)
    }
  }

  const getCurrentUserProfile = async () => {
    setPageIsLoading(true)
    try {
      const res = await authenticated_api.get(`api/v1/profiles/${currentUser.id}`)
      const jsonResponse = res.data.data
      if(res.status === 200){
        setCurrentUser({ ...currentUser, 
          name: jsonResponse.name,
          phoneNumber: jsonResponse.phone_number,
          balance: Number(jsonResponse.balance),
          addressAttributes: {
              addressLine1: (jsonResponse.address.address_line_1).toUpperCase(),
              barangay: jsonResponse.address.barangay,
              city: jsonResponse.address.city,
              province: jsonResponse.address.province,
              zipCode: jsonResponse.address.zip_code
          }
        })
      } else {
        setAlert({ status: "WARNING", message: res?.data?.data?.message || "Something's not quite right." })
      }
    } catch (error:any) {
        setAlert({ status: "ERROR", message: error?.response?.data?.status?.message || "Something went wrong." })
    }
    setPageIsLoading(false)
  }

  return (
    <div className='h-screen'>
      <AlertNotification alert={alert} setAlert={setAlert}/>
      <AlertDialog show={show} />
      {
        pageIsLoading ? 
          <LoadingPage />
          :
          <Routes>
            <Route index path='/' element={<GetStartedPage />} />
            <Route path='/entry' element={
              <EntryPage 
                userType={userSessionData.userType} 
                setUserSessionData={setUserSessionData} 
                userSessionData={userSessionData}
              />
            } />
          <Route path='/signup' element={
              <SignupPage 
                userType={userSessionData.userType} 
                navigate={navigate} 
                api={api} 
                setAlert={setAlert} 
                actionIsLoading={actionIsLoading} 
                setActionIsLoading={setActionIsLoading} 
              />
            } />
            <Route path='/login' element={
              <LoginPage 
                userType={userSessionData.userType} 
                navigate={navigate} 
                api={api} 
                setCurrentUser={setCurrentUser} 
                setAuthKey={setAuthKey} 
                setUserSessionData={setUserSessionData} 
                actionIsLoading={actionIsLoading} 
                setActionIsLoading={setActionIsLoading}
                setAlert={setAlert}
              />
            } />
            <Route path='/verification' element={
              <VerificationPage 
                userType={userSessionData.userType} 
                navigate={navigate} 
                currentUser={currentUser} 
                setCurrentUser={setCurrentUser} 
                setUserSessionData={setUserSessionData} 
                userSessionData={userSessionData}
                actionIsLoading={actionIsLoading} 
                setActionIsLoading={setActionIsLoading}
                setAlert={setAlert} 
              />
            } />
            <Route path='/home' element={
              <HomePage 
                userType={userSessionData.userType} 
                navigate={navigate} 
                selectedService={selectedService} 
                setSelectedService={setSelectedService} 
                currentUser={currentUser}
                setAlert={setAlert} 
                actionIsLoading={actionIsLoading}
                setActionIsLoading={setActionIsLoading}
              />} 
            />
            <Route path='/bookings' element={
              <BookingsPage 
                userType={userSessionData.userType} 
                currentUser={currentUser} 
              />} 
            />
            <Route path='/messages' element={
              <MessagesPage 
                userType={userSessionData.userType} 
              />} 
            />
            <Route path='/profile' element={
              <ProfilePage 
                navigate={navigate}
                userType={userSessionData.userType}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                setAlert={setAlert}
              />} 
            />
            <Route path='/services' element={
              <ServiceMainPage 
                selectedService={selectedService} 
                setSelectedService={setSelectedService} 
                navigate={navigate} 
                serviceDetails={serviceDetails} 
                setServiceDetails={setServiceDetails} 
              />} 
            />
            <Route path='/services/variations' element={
              <ServiceVariationsPage 
                selectedService={selectedService} 
                navigate={navigate} 
                serviceDetails={serviceDetails} 
                setServiceDetails={setServiceDetails} 
              />} 
            />
            <Route path='/bookingDetails' element={
              <BookingDetailsPage 
                navigate={navigate} 
                serviceDetails={serviceDetails} 
                setServiceDetails={setServiceDetails} 
                currentUser={currentUser} 
                setTrackedBooking={setTrackedBooking}
                actionIsLoading={actionIsLoading} 
                setActionIsLoading={setActionIsLoading}
                setAlert={setAlert} 
              />} 
            />
            <Route path='/tracking' element={
              <TrackingPage 
                navigate={navigate} 
                serviceDetails={serviceDetails} 
                setSelectedService={setSelectedService} 
                trackedBooking={trackedBooking} 
              />} 
            />
          </Routes>
      }
    </div>
  )
}