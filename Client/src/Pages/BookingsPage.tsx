import BackButton from "@/Main Components/BackButton";
import NavigationBar from "@/Main Components/NavigationBar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AxiosInstance } from "axios";

interface BookingsPageProps {
    userType: string
    navigate: Function
    currentUser: User
    api: AxiosInstance
}

type User = {
    id: Number,
    addressAttributes: AddressAttributes
}

type AddressAttributes = {
    addressLine1: string,
    barangay: string,
    city: string,
    province: string,
    zipCode: string
}

export default function BookingsPage(props: BookingsPageProps) {
    const { userType, navigate, currentUser, api } = props
    const [ bookings, setBookings ] = useState([])
    const [ selectedBookingTab, setSelectedBookingTab ] = useState("In Progress")

    useEffect(()=>{
        getBookingsData()
    },[])

    const getBookingsData = async () => {
        try {
            const res = await api.get(`api/v1/bookings/${currentUser.id}`)

            if (res.status === 200) {
                console.log(res)
            } else {
                console.log(res)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleClick = (tabName:string) => {
        setSelectedBookingTab(tabName)
    }

    const bookingTabs = [
        { title: 'In Progress' },
        { title: 'Pending' },
        { title: 'Completed' },
    ]

    return(
        <div className="h-screen flex flex-col items-center">
            <BackButton navigate={navigate} />
            <div className={`flex flex-col items-center w-full ${userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary'}`}>
                <h1 className="m-0 mt-4 font-verdana text-[#EBCE9F] font-black header-2">My Bookings</h1>
                <div className={`grid grid-cols-3`}>
                    {
                        bookingTabs.map((tab)=>{
                            return(
                                <Button 
                                    key={tab.title}
                                    variant={"ghost"}
                                    className={`rounded-none font-black ${selectedBookingTab === tab.title ? 'border-b-4 border-black text-black' : 'text-white'}`}
                                    onClick={()=>handleClick(tab.title)}
                                >{tab.title}</Button>
                            )
                        })
                    }
                </div>
            </div>
            <div className="flex-1 h-full w-screen flex flex-col items-center justify-center">
                {
                    bookings.length === 0 ? <h3 className="text-gray-500">You have no {selectedBookingTab} bookings</h3>
                        :
                        bookings.map((booking:object)=>{
                            return(
                                <div></div>
                            )
                        })
                }
            </div>
            <NavigationBar userType={userType} selectedOption="bookings" />
        </div>
    )
}