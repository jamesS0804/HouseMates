import BackButton from "@/Main Components/BackButton";
import NavigationBar from "@/Main Components/NavigationBar";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface BookingsPageProps {
    userType: string,
    navigate: Function
}

export default function BookingsPage(props: BookingsPageProps) {
    const { userType, navigate } = props
    const [ bookings, setBookings ] = useState([])
    const [ selectedBookingTab, setSelectedBookingTab ] = useState("In Progress")

    const handleClick = (tabName:string) => {
        setSelectedBookingTab(tabName)
    }

    const bookingTabs = [
        { title: 'In Progress' },
        { title: 'Completed' },
        { title: 'Cancelled' },
    ]

    return(
        <div className="h-screen flex flex-col items-center">
            <BackButton navigate={navigate} />
            <div className={`flex flex-col items-center w-full ${userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary'}`}>
                <h1 className="m-0 mt-5 font-verdana text-[#EBCE9F] font-black">My Bookings</h1>
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
                    bookings.length === 0 ? <h3>You have no {selectedBookingTab} bookings</h3>
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