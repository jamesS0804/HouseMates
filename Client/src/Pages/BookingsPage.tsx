import NavigationBar from "@/Main Components/NavigationBar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import calendar from "../assets/icons/calendar.png"
import calendar2 from "../assets/icons/calendar2.png"
import addressPin from "../assets/icons/addressPin.png"
import authenticated_api from "@/utils/authenticated_api";

interface BookingsPageProps {
    userType: string
    currentUser: User
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

type CategorizedData = {
    [category: string]: Array<any>;
}

// type Booking = {
//     id: number,
//     scheduled_at: string,
//     service_details: Array<any>,
//     total_cost: number,
//     homeowner: Homeowner,
//     address: Address
// }

// type Address = {
//     address_line_1: string,
//     barangay: string,
//     city: string,
//     province: string,
//     zip_code: string
// }

// type Homeowner = {
//     name: string
// }

type Options = {
    weekday: "short";
    month: "short";
    day: "numeric";
    hour: "numeric";
    minute: "numeric";
    hour12: true;
};

export default function BookingsPage(props: BookingsPageProps) {
    const { userType, currentUser } = props
    const [ bookings, setBookings ] = useState([])
    const [ categorizedData, setCategorizedData ] = useState<CategorizedData>({});
    const [ selectedBookingTab, setSelectedBookingTab ] = useState("In Progress")

    useEffect(()=>{
        getBookingsData()
    },[])

    useEffect(()=>{
        const updatedCategorizedData: CategorizedData = {};
        bookings.forEach((item: any) => {
        if (!updatedCategorizedData[item.status]) {
            updatedCategorizedData[item.status] = [];
        }
        updatedCategorizedData[item.status].push({item});
        });
        setCategorizedData(updatedCategorizedData);
    },[bookings])

    const getBookingsData = async () => {
        try {
            const res = await authenticated_api.get(`api/v1/bookings/${currentUser.id}`)
            const jsonResponse = res.data.data
            if (res.status === 200) {
                setBookings(jsonResponse)
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

    const handleComplete = async (booking:any) => {
        try {
            const res = await authenticated_api.patch(`api/v1/bookings/${booking.item.id}`,
                {
                    booking: {
                        status: 'COMPLETED',
                        homeowner_id: currentUser.id,
                        housemate_id: booking.item.housemate.id
                    }
                }
            )
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div className="h-screen flex flex-col items-center">
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
            <div className="overflow-auto h-full">
                <div className={
                    `w-full flex flex-col items-center justify-center gap-3 p-5 pb-24 ${categorizedData[selectedBookingTab.toUpperCase()]?.length === undefined? 'h-full' : ''}`
                    }>
                    {
                        categorizedData[selectedBookingTab.toUpperCase()]?.length === undefined ? 
                            <div className="flex justify-center">
                                <h3 className="text-gray-500 h-full">You have no {selectedBookingTab} bookings</h3>
                            </div>
                            :
                            categorizedData[selectedBookingTab.toUpperCase()].map((booking:any)=>{
                                const address = booking.item.address
                                const addressLine1 = address.address_line_1
                                const barangay = address.barangay
                                const city = address.city
                                const province = address.province
                                const zipCode = address.zip_code

                                const dateString = booking.item.scheduled_at;
                                const dateObject = new Date(dateString);

                                const options: Options = {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true
                                };

                                const formattedDate = dateObject.toLocaleDateString("en-US", options);
                                return(
                                    <div key={booking.id} className={`h-full w-full p-3 rounded-xl flex flex-col items-center justify-center gap-3 border-2 ${userType === 'Homeowner' ? 'border-primary': 'border-secondary'}`}>
                                        <div className="flex flex-col w-full gap-2 p-1">
                                            <h3 className="font-black text-lg">{booking.item.homeowner.name}</h3>
                                            <div className="flex gap-2 justify-center items-center">
                                                <img className="w-10" src={addressPin} />
                                                <p className="text-xs">{`${addressLine1} ${barangay}, ${city}, ${province}, ${zipCode}`}</p>
                                            </div>
                                        </div>
                                        <div className={`border ${ userType === 'Homeowner' ? 'border-primary' : 'border-secondary' } w-[calc(100%+1.5rem)]`} />
                                        <div className="w-full flex flex-col items-start gap-2">
                                            <h3 className="font-black mt-2">Service Details</h3>
                                            <div className="flex gap-2 w-full justify-start items-center">
                                                <img className="w-8" src={userType === 'Homeowner' ? calendar : calendar2}/>
                                                <p className="text-sm">{formattedDate}</p>
                                            </div>
                                            <h3 className="font-black mt-3">Extra Service/s</h3>
                                            <ul className={`flex flex-col gap-1 w-full list-disc ${booking.item.service_details.length === 0 ? '': 'pl-8'}`}>
                                                {
                                                    booking.item.service_details.length === 0 ? 
                                                        <p className="w-full text-center">No extra service availed.</p>
                                                        :
                                                        booking.item.service_details.map((subservice:any)=>{
                                                                return(
                                                                    <li key={subservice.id}>{`${subservice.quantity} order of ${subservice.title}`}</li>
                                                                ) 
                                                        }) 
                                                }
                                            </ul>
                                            <div className="flex w-full mt-10 text-xl">
                                                <div className="font-black">Total:</div>
                                                <div className="ml-auto font-black">₱{Number(booking.item.total_cost).toLocaleString('en-PH')}</div>
                                            </div>
                                        </div>
                                        <div className={`border ${ userType === 'Homeowner' ? 'border-primary' : 'border-secondary' } w-[calc(100%+1.5rem)]`} />
                                        <div className="w-full flex gap-2">
                                            <Button className={`border rounded-xl w-full p-2 text-xs text-white ${userType === 'Homeowner' ? 'border-primary bg-primary' : 'border-secondary bg-secondary'}`}>{`Contact ${userType === 'Homeowner' ? 'Housemate' : 'Homeowner'}`}</Button>
                                            {
                                                userType === 'Homeowner' && selectedBookingTab === 'In Progress' ?
                                                    <Button onClick={()=>handleComplete(booking)} className="rounded-xl w-full p-2 text-base border border-green-500 bg-green-500 text-white">Complete</Button>
                                                    :
                                                    <></>
                                            }
                                            
                                        </div>
                                    </div>
                                )
                            })
                    }
                </div>
            </div>
            <NavigationBar userType={userType} selectedOption="bookings" />
        </div>
    )
}