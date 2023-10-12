import BackButton from "@/Main Components/BackButton";
import { Button } from "@/components/ui/button";
import map from "../assets/images/map.png"
import message from "../assets/icons/message.png"
import phone from "../assets/icons/phone.png"

interface TrackingPageProps {
    navigate: Function
    serviceDetails: ServiceDetails
    setSelectedService: Function
}

type ServiceDetails = {
    service: Record<string, any>,
    data: Record<string, any>,
    totalCost: number,
    date: string
}
export default function TrackingPage(props: TrackingPageProps) {
    const { navigate, serviceDetails, setSelectedService } = props
    return(
        <div className="flex flex-col">
            <BackButton navigate={navigate} />
            <div className="flex flex-col items-center w-full bg-primary">
                <h1 className="pl-3 my-4 font-verdana text-[#EBCE9F] font-black">Booking Details</h1>
            </div>
            <div className="h-[580px] w-full">
                <img className="h-full w-full object-fit" src={map} />
            </div>
            <div className="mt-auto fixed bottom-0">
                <div className="flex flex-col relative border border-primary p-2 bg-white rounded-t-xl pb-20">
                    <h3 className="font-black text-primary">Searching ...</h3>
                    <div className="flex gap-1 items-center">
                        <p className="font-black">HouseMate</p>
                        <div className="flex gap-2 ml-auto">
                            <img className="h-8 w-8" src={phone} />
                            <img className="h-8 w-8" src={message} />
                        </div>
                    </div>
                    <div className="bg-white absolute h-fit w-full left-0 bottom-0 border font-semibold border-primary text-primary flex items-center text-xs text-center p-3 rounded-t-lg">
                        <div>
                            <h3 className="font-black text-xl text-black text-left">Total Cost:</h3>
                            <p className="text-black">1 cleaner for 2 hrs 15 mins</p>
                        </div>
                        <p className="ml-auto text-xl font-black text-black">₱{serviceDetails.totalCost}</p>
                    </div>
                </div>
                <Button onClick={()=> {setSelectedService(""); navigate('/home')}} className="w-screen rounded-none bg-primary border-none font-bold text-white text-lg">Home</Button>
            </div>
        </div>
    )
}