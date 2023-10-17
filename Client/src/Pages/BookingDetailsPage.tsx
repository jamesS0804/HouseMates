import BackButton from "@/Main Components/BackButton";
import { Button } from "@/components/ui/button";
import addressPin from "../assets/icons/addressPin.png"
import { Calendar } from "@/components/ui/calendar"
import { useEffect, useState } from "react";
import cash from "../assets/icons/cash.png"
import Counter from "@/Main Components/Counter";
import getTotalCost from "@/utils/getTotalCost";
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from "@mui/x-date-pickers"
import GeneralCleaningBookingDetails from "@/Main Components/Booking Details/GeneralCleaningBookingDetails";
import extractDataFromDate from "@/utils/extractDataFromDate";
import check from "../assets/images/check.png"
import authenticated_api from "@/utils/authenticated_api";
import { Loader2 } from "lucide-react";

type ServiceDetails = {
    service: Record<string, any>,
    data: Record<string, any>,
    totalCost: number,
    date: string,
    time: Time
}
interface BookingDetailsPropsPage {
    navigate: Function
    serviceDetails: ServiceDetails
    setServiceDetails: Function
    currentUser: User
    setTrackedBooking: Function
    actionIsLoading: boolean
    setActionIsLoading: Function
    setAlert: Function
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

type Time = {
    $H: string,
    $m: string
}

export default function BookingDetailsPage(props: BookingDetailsPropsPage){
    const { navigate, serviceDetails, setServiceDetails, currentUser, setTrackedBooking, actionIsLoading, setActionIsLoading, setAlert } = props
    const [ date, setDate ] = useState<Date | undefined>(new Date())
    const [ page, setPage ] = useState(1)
    const [ time, setTime ] = useState<Dayjs | null>(dayjs());
    const [ extraServiceCost, setExtraServiceCost ] = useState(0)

    useEffect(()=>{
        setPage(1)
    },[])

    useEffect(()=>{    
        if(Object.keys(serviceDetails.data).length !== 0) {
            const totalPrice = getTotalCost(serviceDetails)
            setServiceDetails({ ...serviceDetails, totalCost: totalPrice }) 
        }
        const extraServiceCost = serviceDetails.data['Extra Service'].reduce((acc: number, service: { quantity?: number, price: number }) => {
            const quantity = service.quantity || 1;
            return acc + service.price * quantity;
        }, 0);
        setExtraServiceCost(extraServiceCost)
    },[serviceDetails.data])

    useEffect(()=>{
        setServiceDetails(serviceDetails)
    },[page])

    const nextPage = (page:number) => {
        setServiceDetails({ ...serviceDetails, time: time, date: date })
        setPage(page)
    }

    const submitBooking = async () => {
        
        setActionIsLoading(true)
        const day = extractDataFromDate(serviceDetails.date, "day")
        const month = extractDataFromDate(serviceDetails.date, "month")
        const date = extractDataFromDate(serviceDetails.date, "date")
        const year = extractDataFromDate(serviceDetails.date, "year")
        const hour = (Number(serviceDetails.time.$H) + 12) % 12
        const minute = serviceDetails.time.$m
        const scheduled_at = `${hour}:${minute} ${Number(hour) % 12 ? "PM" : "AM"} ${month} ${date}, ${year} ${day}`
        try {
            const res = await authenticated_api.post("api/v1/bookings", 
                {
                    booking: {
                        homeowner_id: currentUser.id,
                        service: serviceDetails.service,
                        payment_method: "Credit Wallet",
                        total_cost: serviceDetails.totalCost,
                        status: "PENDING",
                        service_details: serviceDetails.data['Extra Service'],
                        address_attributes: {
                            address_line_1: currentUser.addressAttributes.addressLine1,
                            barangay: currentUser.addressAttributes.barangay,
                            city: currentUser.addressAttributes.city,
                            province: currentUser.addressAttributes.province,
                            zip_code: currentUser.addressAttributes.zipCode,
                        },
                        scheduled_at: scheduled_at
                    }
                }
            )
            if (res.status === 200) {
                setTrackedBooking(res.data.data)
                navigate('/tracking')
            } else {
                setAlert({ status: "WARNING", message: res?.data?.data?.message || "Something's not quite right." })
            }
        } catch (error:any) {
            setAlert({ status: "ERROR", message: error?.response?.data?.status.message || "Something went wrong." })
        }
        setActionIsLoading(false)
    }

    return(
        <div className="flex flex-col gap-2">
            {
                page === 1 ? 
                    <BackButton navigate={navigate} />
                    :
                    page === 2 ?
                        <BackButton navigate={navigate} redirect={setPage} redirectValue={1} />
                        :
                        <BackButton navigate={navigate} redirect={setPage} redirectValue={2} />
            }
            <div className="flex flex-col items-center w-full bg-primary">
                <h1 className="pl-3 my-4 font-verdana text-[#EBCE9F] font-black">Booking Details</h1>
            </div>
            <div className="p-2 flex flex-col items-center gap-5">
                {
                    page !== 3 ?
                        <div className="border border-primary flex flex-col shadow-shadow p-2 gap-1 rounded-xl">
                            <h3 className="font-black text-primary">Address Details</h3>
                            <div className="flex gap-2 items-center">
                                <img className="h-11" src={addressPin}/>
                                <div className="flex flex-col gap-1 text-sm">
                                    <p>{`${currentUser.addressAttributes.addressLine1.toUpperCase()}, 
                                        ${currentUser.addressAttributes.barangay}, ${currentUser.addressAttributes.city}, 
                                        ${currentUser.addressAttributes.province}, ${currentUser.addressAttributes.zipCode}`}
                                    </p>
                                    <a className="text-primary font-black underline">Change</a>
                                </div>
                            </div>
                        </div>
                        :
                        <></>
                }
                {
                    page === 1 ? 
                        <div className="w-full">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="w-full bg-white"
                            />
                            <div className="w-full">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <StaticTimePicker value={time} onChange={(newValue) => setTime(newValue)} />
                                </LocalizationProvider>
                            </div>
                            
                        </div>
                        :
                        page === 2 ?
                            <div className="flex flex-col gap-4 w-full">
                                <div className="flex flex-col gap-2 border border-primary shadow-shadow w-full p-2 rounded-xl">
                                    <GeneralCleaningBookingDetails serviceDetails={serviceDetails} />
                                </div>
                                <div className="flex flex-col gap-2 border border-primary shadow-shadow w-full p-3 rounded-xl mb-44">
                                    <h3 className="font-black text-primary text-xl">Price Breakdown</h3>
                                    <div className="flex">
                                        <p className="font-black">Basic Price</p>
                                        <p className="font-black text-secondary ml-auto">₱{serviceDetails.service.price}</p>
                                    </div>
                                    {
                                        <>
                                            {
                                                serviceDetails.data['Home Type'].price > 0 &&
                                                <div className="flex">
                                                    <p className="font-black">{serviceDetails.data['Home Type'].title}</p>
                                                    <p className="font-black text-secondary ml-auto">₱{serviceDetails.data['Home Type'].price}</p>
                                                </div>
                                            }
                                            {
                                                serviceDetails.data['Room Type'].price > 0 &&
                                                <div className="flex">
                                                    <p className="font-black">{serviceDetails.data['Room Type'].title}</p>
                                                    <p className="font-black text-secondary ml-auto">₱{serviceDetails.data['Room Type'].price}</p>
                                                </div>
                                            }
                                            {
                                                serviceDetails.data['Bathroom Count'].price > 0 &&
                                                <div className="flex">
                                                <p className="font-black">{serviceDetails.data['Bathroom Count'].title}</p>
                                                <p className="font-black text-secondary ml-auto">₱{serviceDetails.data['Bathroom Count'].price}</p>
                                            </div>
                                            }
                                        </>
                                    }
                                    <hr className="border-1 border-black"/>
                                    <div className="flex flex-col gap-2">
                                        <h3>Extra Services</h3>
                                        {
                                            serviceDetails.data['Extra Service'].length === 0 ? <h3 className="text-center">No extra services availed</h3>
                                                :
                                                serviceDetails.data['Extra Service'].map((extraService:any)=>{
                                                    return(
                                                        <div key={extraService.id} className="flex flex-col gap-1">
                                                            <hr className="border-1 border-black"/>
                                                            <div  className="flex gap-2">
                                                                <div>
                                                                    <p className="font-black">{extraService.title}</p>
                                                                    <Counter unit={extraService.unit} valueType="Extra Service" value={extraService} inputData={serviceDetails.data} setInputData={setServiceDetails} rootData={serviceDetails} />
                                                                </div>
                                                                <p className="ml-auto font-black text-secondary">₱{extraService.price}<span className="text-xs"> / {extraService.unit}</span></p>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="h-full w-full flex justify-center items-center flex-1 grow relative p-3">
                                <img className="absolute top-0 animate-[ping_2s_ease-in-out]" src={check}/>
                                <div className="border border-primary w-full rounded-xl p-3 pt-10 mt-12">
                                    <div className="border border-[#A3C3CA66] w-full rounded-xl bg-[#A3C3CA66]">
                                        <div className="flex flex-col items-center mt-5">
                                            <p className="font-black">Great!</p>
                                            <h1 className="text-primarySelected font-bold text-3xl">Payment Success</h1>
                                        </div>
                                        <div className="absolute top-[78%] left-[6.5%] border-2 border-dotted border-black w-[87%]"/>
                                        <div className="w-full rounded-xl flex flex-col gap-5 items-center p-4 pt-7">
                                            
                                            <div className="flex w-full">
                                                <p className="font-black">Basic Price</p>
                                                <p className="font-black text-secondarySelected ml-auto">₱{serviceDetails.service.price}</p>
                                            </div>
                                            {
                                                serviceDetails.data['Home Type'].price > 0 &&
                                                <div className="flex w-full">
                                                    <p className="font-black">{serviceDetails.data['Home Type'].title}</p>
                                                    <p className="font-black text-secondarySelected ml-auto">₱{serviceDetails.data['Home Type'].price}</p>
                                                </div>
                                            }
                                            {
                                                serviceDetails.data['Room Type'].price > 0 &&
                                                <div className="flex w-full">
                                                    <p className="font-black">{serviceDetails.data['Room Type'].title}</p>
                                                    <p className="font-black text-secondarySelected ml-auto">₱{serviceDetails.data['Room Type'].price}</p>
                                                </div>
                                            }
                                            {
                                                serviceDetails.data['Bathroom Count'].price > 0 &&
                                                <div className="flex w-full">
                                                <p className="font-black">{serviceDetails.data['Bathroom Count'].title}</p>
                                                <p className="font-black text-secondarySelected ml-auto">₱{serviceDetails.data['Bathroom Count'].price}</p>
                                            </div>
                                            }
                                            <div className="flex w-full">
                                                <p className="font-black">Extra Service</p>
                                                <p className="font-black text-secondarySelected ml-auto">₱{Number(extraServiceCost).toLocaleString('en-PH')}</p>
                                            </div>
                                            <div className="flex w-full">
                                                <p className="font-black">Payment Method</p>
                                                <p className="font-black text-secondarySelected ml-auto">Credit</p>
                                            </div>
                                            <div className="flex flex-col gap-1 w-full items-center mt-20">
                                                <p className="font-black text-primarySelected text-lg">Total Pay</p>
                                                <p className="font-black text-3xl">₱{Number(serviceDetails.totalCost).toLocaleString('en-PH')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                }
            </div>
            <div className="mt-auto fixed bottom-0">
                { 
                    page === 2 ?
                        <div>
                            <div className="flex flex-col relative border border-primary p-2 bg-white rounded-t-xl gap-2 pb-16">
                                <h3 className="font-black text-primary">Payment Method</h3>
                                <div className="flex gap-1">
                                    <img className="h-6" src={cash} />
                                    <p className="font-black ">Credit/Debit Card</p>
                                    <p className="underline font-black ml-auto text-primary">Change</p>
                                </div>
                                <div className="bg-white absolute h-fit w-full left-0 bottom-0 border font-semibold border-primary text-primary flex text-xs text-center p-3 rounded-t-lg">
                                    <h3 className="font-black text-xl">Total Cost:</h3>
                                    <p className="ml-auto text-xl font-black">₱{Number(serviceDetails.totalCost).toLocaleString('en-PH')}</p>
                                </div>
                            </div>
                        </div> : <></>
                }
                {
                    page === 1 ? 
                        <Button onClick={()=>nextPage(2)} className="w-screen rounded-none bg-primary border-none font-bold text-white text-lg">
                            Next
                        </Button>
                        : 
                        page === 2 ? 
                        <Button onClick={()=>nextPage(3)} className="w-screen rounded-none bg-primary border-none font-bold text-white text-lg">
                            Book
                        </Button>
                        : 
                        <Button onClick={submitBooking} className="w-screen rounded-none bg-primary border-none font-bold text-white text-lg">
                            {
                                actionIsLoading ? 
                                    <>Viewing Map<Loader2 className="animate-spin" /></>
                                    :
                                    "View Map"
                            }
                        </Button>
                    
                }
            </div>
        </div>
    )
}