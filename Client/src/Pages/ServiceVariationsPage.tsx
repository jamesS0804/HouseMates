import BackButton from "@/Main Components/BackButton"
import { Button } from "@/components/ui/button"
import generalCleaningBG from "../assets/images/generalCleaningBG.png"
import airconServicesBG from "../assets/images/airconServicesBG.png"
import plumbingBG from "../assets/images/plumbingBG.png"
import GeneralCleaning from "@/Main Components/Service Variations/GeneralCleaning"
import { useLayoutEffect } from "react"
import getTotalCost from "@/utils/getTotalCost"

interface ServiceVariationsPageProps {
    selectedService: string
    setSelectedService?: Function
    navigate: Function
    serviceDetails: ServiceDetails
    setServiceDetails: Function
}

type ServiceDetails = {
    service: Record<string, any>
    data: Record<string, any>;
    totalCost: number;
}

type Services = {
    [serviceName: string] : {
        title: string,
        image: any,
        price: string,
        element?: any
    };
};

export default function ServiceVariationsPage(props: ServiceVariationsPageProps) {
    const { selectedService, navigate, serviceDetails, setServiceDetails } = props

    const services: Services = {
        'General Cleaning': { 
            title: 'Cleaning Services', 
            image: generalCleaningBG, 
            price: '399', 
            element: <GeneralCleaning serviceDetails={serviceDetails} setServiceDetails={setServiceDetails} />},
        'Aircon Services': { 
            title: 'Aircon Services', 
            image: airconServicesBG, 
            price: '699'},
        'Plumbing': { 
            title: 'Plumbing Services', 
            image: plumbingBG, 
            price: '599'},
    }
    const service = services['General Cleaning']    
    
    useLayoutEffect(()=>{
        if(Object.keys(serviceDetails.data).length !== 0) {
            const totalPrice = getTotalCost(serviceDetails)
            setServiceDetails({ ...serviceDetails, totalCost: totalPrice }) 
        }
    },[serviceDetails.data])

    const handleSubmit = () => {
        console.log(serviceDetails)
        navigate("/bookingDetails")
    }
    return(
        <div className="h-screen flex flex-col relative">
            <BackButton navigate={navigate}/>
            {
                selectedService === "" ? <></> :
                <>
                    <div className="h-36 relative">
                        <img className="h-36 w-screen object-none -scale-x-1" src={service.image}/>
                        <h1 className="absolute w-10 m-0 bottom-1 text-3xl font-bold px-3 text-secondary font-verdana [text-shadow:0px_3px_4px_rgba(235_206_159_/_70%)]">{service.title.toUpperCase()}</h1>
                    </div>
                    { service.element }
                    <div className="mt-auto fixed bottom-0">
                        <div className="bg-white border border-primary flex text-primary text-xs text-center p-2 rounded-t-lg">
                            <h3 className="text-xl font-black flex items-center">Total cost:</h3>
                            <div className="flex flex-col ml-auto">
                                <p className="text-2xl font-black">₱{serviceDetails.totalCost}</p>
                                <p className="text-xs">includes materials</p>
                            </div>
                        </div>
                        <Button onClick={handleSubmit} className="w-screen rounded-none bg-primary border-none font-bold text-white text-lg">Next</Button>
                    </div>
                </>
            }
        </div>
    )
}