import NavigationBar from "@/Main Components/NavigationBar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import addressPin from "../assets/icons/addressPin.png"
import authenticated_api from "@/utils/authenticated_api";
import calendar from "../assets/icons/calendar.png"
import clock from "../assets/icons/clock.png"
import home from "../assets/icons/home.png"
import bed from "../assets/icons/bed.png"
import bathtub from "../assets/icons/bathtub.png"

interface BookingsPageProps {
    userType: string
    currentUser: User
    actionIsLoading: boolean
    setActionIsLoading: Function
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
    const { userType, currentUser, actionIsLoading, setActionIsLoading } = props
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
        setActionIsLoading(true)
        try {
            const res = await authenticated_api.get(`api/v1/bookings/${currentUser.id}`)
            const jsonResponse = res.data.data
            if (res.status === 200) {
                setBookings(jsonResponse)
            }
        } catch (error) {
            console.log(error)
        }
        setActionIsLoading(false)
    }

    const handleClick = (tabName:string) => {
        setSelectedBookingTab(tabName)
        getBookingsData()
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
            if(res.status === 200){
                getBookingsData()
            }
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
                {
                    actionIsLoading ?
                        <div className="w-screen flex flex-col items-center justify-center gap-3 p-5 pb-24">
                            <div className={`h-[27.5rem] w-full p-3 rounded-xl flex animate-pulse flex-col items-center justify-center gap-3 border-2 ${userType === 'Homeowner' ? 'border-[#F7F7F7] bg-primary': 'border-[#F7F7F7] bg-secondary'}`}>
                                <div className="flex flex-col w-full gap-2 p-1">
                                    <h3 className="font-black w-1/3 h-4 text-lg bg-[#F7F7F7] rounded-xl"></h3>
                                    <div className="flex gap-2 justify-center items-center flex-col">
                                        <p className="text-xs h-3 w-full bg-[#F7F7F7] rounded-xl"></p>
                                        <p className="text-xs h-3 w-full bg-[#F7F7F7] rounded-xl"></p>
                                    </div>
                                </div>
                                <div className={`border border-white w-[calc(100%+1.5rem)]`} />
                                <div className="w-full h-2/3 flex flex-col items-start gap-3">
                                    <p className="text-xs h-4 w-1/3 bg-[#F7F7F7] rounded-xl"></p>
                                    <div className="flex gap-2 w-full justify-start items-center">
                                        <p className="text-xs h-3 w-full bg-[#F7F7F7] rounded-xl"></p>
                                    </div>
                                    <p className="text-xs h-4 w-1/3 bg-[#F7F7F7] rounded-xl mt-10"></p>
                                    <div className="flex w-full justify-start items-center flex-col gap-3">
                                        <p className="text-xs h-3 w-full bg-[#F7F7F7] rounded-xl"></p>
                                        <p className="text-xs h-3 w-full bg-[#F7F7F7] rounded-xl"></p>
                                    </div>
                                    <div className="flex w-full mt-auto text-xl gap-20">
                                        <p className="text-xs h-4 w-full bg-[#F7F7F7] rounded-xl"></p>
                                        <p className="text-xs h-4 w-full bg-[#F7F7F7] rounded-xl"></p>
                                    </div>
                                </div>
                                <div className={`border border-white w-[calc(100%+1.5rem)]`} />
                                <div className="w-full flex gap-2 items-center justify-center">
                                    <Button className={`border rounded-xl mt-3 w-full p-2 text-xs text-white bg-[#F7F7F7] border-[#F7F7F7]`}></Button>
                                </div>
                            </div>
                            <div className={`h-[27.5rem] w-full p-3 rounded-xl flex animate-pulse flex-col items-center justify-center gap-3 border-2 ${userType === 'Homeowner' ? 'border-[#F7F7F7] bg-primary': 'border-[#F7F7F7] bg-secondary'}`}>
                                <div className="flex flex-col w-full gap-2 p-1">
                                    <h3 className="font-black w-1/3 h-4 text-lg bg-gray-200 rounded-xl"></h3>
                                    <div className="flex gap-2 justify-center items-center flex-col">
                                        <p className="text-xs h-3 w-full bg-gray-200 rounded-xl"></p>
                                        <p className="text-xs h-3 w-full bg-gray-200 rounded-xl"></p>
                                    </div>
                                </div>
                                <div className={`border border-white w-[calc(100%+1.5rem)]`} />
                                <div className="w-full h-2/3 flex flex-col items-start gap-3">
                                    <p className="text-xs h-4 w-1/3 bg-gray-200 rounded-xl"></p>
                                    <div className="flex gap-2 w-full justify-start items-center">
                                        <p className="text-xs h-3 w-full bg-gray-200 rounded-xl"></p>
                                    </div>
                                    <p className="text-xs h-4 w-1/3 bg-gray-200 rounded-xl mt-10"></p>
                                    <div className="flex w-full justify-start items-center flex-col gap-3">
                                        <p className="text-xs h-3 w-full bg-gray-200 rounded-xl"></p>
                                        <p className="text-xs h-3 w-full bg-gray-200 rounded-xl"></p>
                                    </div>
                                    <div className="flex w-full mt-auto text-xl gap-20">
                                        <p className="text-xs h-4 w-full bg-gray-200 rounded-xl"></p>
                                        <p className="text-xs h-4 w-full bg-gray-200 rounded-xl"></p>
                                    </div>
                                </div>
                                <div className={`border border-white w-[calc(100%+1.5rem)]`} />
                                <div className="w-full flex gap-2 items-center justify-center">
                                    <Button className={`border rounded-xl mt-3 w-full p-2 text-xs text-white bg-gray-200 border-white`}></Button>
                                </div>
                            </div>
                        </div>
                        :
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
                                        const categorizedByServiceType:any = {}
                                        booking.item.service_details.forEach((subservice:any)=>{
                                            if (!categorizedByServiceType[subservice.category]) {
                                                categorizedByServiceType[subservice.category] = [];
                                            }
                                            categorizedByServiceType[subservice.category].push({subservice});
                                        })
                                        const formattedDate = dateObject.toLocaleDateString("en-US", options);
                                        return(
                                            <div key={booking.item.id} className={`h-full w-full p-3 rounded-xl flex flex-col items-center justify-center gap-3 border-2 ${userType === 'Homeowner' ? 'border-primary': 'border-secondary'}`}>
                                                <div className="flex flex-col w-full gap-2 p-1">
                                                    <h3 className="font-black text-lg">{booking.item.homeowner.name}</h3>
                                                    <div className="flex gap-2 justify-center items-center">
                                                        <img className="w-10" src={addressPin} />
                                                        <p className="text-xs">{`${addressLine1} ${barangay}, ${city}, ${province}, ${zipCode}`}</p>
                                                    </div>
                                                </div>
                                                {
                                                    booking.item?.housemate?.id === '' ?
                                                        <></>
                                                        :
                                                        <>
                                                            <div className={`border ${ userType === 'Homeowner' ? 'border-primary' : 'border-secondary' } w-[calc(100%+1.5rem)]`} />
                                                            <div className="flex flex-col w-full gap-2 p-1">
                                                                <h3 className="font-black text-lg">Assigned housemate:</h3>
                                                                <h3 className="font-black text-base">{booking.item.housemate.name}</h3>
                                                            </div>
                                                        </>
                                                }
                                                <div className={`border ${ userType === 'Homeowner' ? 'border-primary' : 'border-secondary' } w-[calc(100%+1.5rem)]`} />
                                                <div className="w-full flex flex-col items-start gap-2">
                                                    <h3 className="font-black mt-2">Service Details</h3>
                                                    <div className="flex gap-2 w-full justify-start items-center">
                                                        <img className="w-8" src={home}/>
                                                        <p className="text-sm">{categorizedByServiceType['Home Type'][0]['subservice'].title}</p>
                                                    </div>
                                                    <div className="flex gap-2 w-full justify-start items-center">
                                                        <img className="w-8" src={bed}/>
                                                        <p className="text-sm">{categorizedByServiceType['Room Type'][0]['subservice'].title}</p>
                                                    </div>
                                                    <div className="flex gap-2 w-full justify-start items-center">
                                                        <img className="w-8" src={bathtub}/>
                                                        <p className="text-sm">{categorizedByServiceType['Bathroom Count'][0]['subservice'].title}</p>
                                                    </div>
                                                    <div className="flex gap-2 w-full justify-start items-center">
                                                        <img className="w-8" src={clock}/>
                                                        <p className="text-sm">2 hours, 15 minutes</p>
                                                    </div>
                                                    <div className="flex gap-2 w-full justify-start items-center">
                                                        <img className="w-8" src={calendar}/>
                                                        <p className="text-sm">{formattedDate}</p>
                                                    </div>
                                                    <h3 className="font-black mt-3">Extra Service/s</h3>
                                                    <ul className={`flex flex-col gap-1 w-full list-disc ${booking.item.service_details.length === 0 ? '': 'pl-8'}`}>
                                                        {
                                                            categorizedByServiceType['Extra Service'].length === 0 ? 
                                                                <p className="w-full text-center">No extra service availed.</p>
                                                                :
                                                                categorizedByServiceType['Extra Service'].map((item:any)=>{

                                                                        return(
                                                                            <li key={item.subservice.subservice_id}>{`${item.subservice.quantity} order of ${item.subservice.title}`}</li>
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
                }
            </div>
            <NavigationBar userType={userType} selectedOption="bookings" />
        </div>
    )
}