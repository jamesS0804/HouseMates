import BackButton from "@/Main Components/BackButton";
import { Button } from "@/components/ui/button";
import addressPin from "../assets/icons/addressPin.png"
import { Calendar } from "@/components/ui/calendar"
import { useLayoutEffect, useState } from "react";
import cash from "../assets/icons/cash.png"
import Counter from "@/Main Components/Counter";
import GetTotalCost from "@/utils/GetTotalCost";

type ServiceDetails = {
    service: Record<string, any>
    data: Record<string, any>;
    totalCost: number;
}

interface BookingDetailsPropsPage {
    navigate: Function
    serviceDetails: ServiceDetails
    setServiceDetails: Function
}

export default function BookingDetailsPage(props: BookingDetailsPropsPage){
    const { navigate, serviceDetails, setServiceDetails } = props
    const [ date, setDate ] = useState<Date | undefined>(new Date())
    const [ page, setPage ] = useState(1)
    
    useLayoutEffect(()=>{
        if(Object.keys(serviceDetails.data).length !== 0) {
            const totalPrice = GetTotalCost(serviceDetails)
            setServiceDetails({ ...serviceDetails, totalCost: totalPrice }) 
        }
    },[serviceDetails.data])

    const handleClick = () => {
        if(page === 1 ) setPage(2)
        console.log(date)
        console.log(serviceDetails)
    }
    return(
        <div className="flex flex-col gap-2">
            <BackButton navigate={navigate} />
            <div className="flex flex-col items-center w-full bg-primary">
                <h1 className="my-4 font-verdana text-[#EBCE9F] font-black">Booking Details</h1>
            </div>
            <div className="p-2 flex flex-col items-center gap-5">
                <div className="border border-primary flex flex-col shadow-shadow p-2 rounded-xl">
                    <h3 className="font-black text-primary">Address Details</h3>
                    <div className="flex gap-2 items-center">
                        <img className="h-11" src={addressPin}/>
                        <div className="flex flex-col gap-2 text-sm">
                            <p>33F Robinsons Summit Center, 6783 Ayala Avenue, Makati</p>
                            <a className="text-primary font-black underline">Change</a>
                        </div>
                    </div>
                </div>
                {
                    page === 1 ? 
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border w-full bg-[rgba(116_171_183_/0.65)]"
                        />
                        :
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex flex-col gap-2 border border-primary shadow-shadow w-full p-2 rounded-xl">
                                <h3 className="font-black text-primary">Booking Details</h3>
                                <div className="flex gap-2">
                                    <img />
                                    <p>House</p>
                                </div>
                                <div className="flex gap-2">
                                    <img />
                                    <p>House</p>
                                </div>
                                <div className="flex gap-2">
                                    <img />
                                    <p>House</p>
                                </div>
                                <div className="flex gap-2">
                                    <img />
                                    <p>House</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 border border-primary shadow-shadow w-full p-2 rounded-xl">
                                <h3 className="font-black text-primary">Price Breakdown</h3>
                                <div className="flex">
                                    <p className="font-black">Basic Price</p>
                                    <p className="font-black text-secondary ml-auto">{serviceDetails.service.price}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3>Extra Services</h3>
                                    {
                                        serviceDetails.data.extraServices.map((extraService:any)=>{
                                            return(
                                                <div key={extraService.type} className="flex gap-2">
                                                    <img />
                                                    <div>
                                                        <p>{extraService.type}</p>
                                                        <Counter unit={extraService.unit} valueType="extraServices" value={extraService} inputData={serviceDetails.data} setInputData={setServiceDetails} rootData={serviceDetails} />
                                                    </div>
                                                    <p className="ml-auto font-black text-secondary">{extraService.price}</p>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                }
            </div>
            <div className="mt-auto fixed bottom-0">
                {
                    page === 1 ? <></> : 
                        <div>
                            <div className="flex flex-col relative border border-primary p-2 rounded-t-xl gap-2 pb-16">
                                <h3 className="font-black text-primary">Payment Method</h3>
                                <div className="flex gap-1">
                                    <img className="h-6" src={cash} />
                                    <p className="font-black ">Credit/Debit Card</p>
                                    <p className="underline font-black ml-auto text-primary">Change</p>
                                </div>
                                <div className="bg-white absolute h-fit w-full left-0 bottom-0 border font-semibold border-primary text-primary flex text-xs text-center p-3 rounded-t-lg">
                                    <h3 className="font-black text-xl">Total Cost:</h3>
                                    <p className="ml-auto text-xl">{serviceDetails.totalCost}</p>
                                </div>
                            </div>
                            
                        </div>
                }
                <Button onClick={handleClick} className="w-screen rounded-none bg-primary border-none font-bold text-white text-lg">Next</Button>
            </div>
        </div>
    )
}