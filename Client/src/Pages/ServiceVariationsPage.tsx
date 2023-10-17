import BackButton from "@/Main Components/BackButton"
import { Button } from "@/components/ui/button"
import GeneralCleaning from "@/Main Components/Service Variations/GeneralCleaning"
import { useEffect } from "react"
import getTotalCost from "@/utils/getTotalCost"

interface ServiceVariationsPageProps {
    selectedService: SelectedService
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
        element?: any
    };
};

type SelectedService = {
    id: number,
    serviceName: string,
    background: string,
    title: string
}

export default function ServiceVariationsPage(props: ServiceVariationsPageProps) {
    const { selectedService, navigate, serviceDetails, setServiceDetails } = props

    const services: Services = {
        'General Cleaning': { 
            element: <GeneralCleaning serviceDetails={serviceDetails} setServiceDetails={setServiceDetails} selectedService={selectedService}/>},
    }
    const service = services[selectedService.serviceName]    

    useEffect(()=>{
        if(Object.keys(serviceDetails.data).length !== 0) {
            const totalPrice = getTotalCost(serviceDetails)
            console.log('######################################################')
            console.log(`total price: ${totalPrice}; type: ${typeof totalPrice}`)
            setServiceDetails({ ...serviceDetails, totalCost: totalPrice }) 
        }
    },[serviceDetails.data])

    const handleSubmit = () => {
        navigate("/bookingDetails")
    }
    return(
        <div className="h-screen flex flex-col relative">
            <BackButton navigate={navigate}/>
            {
                selectedService.serviceName === "" ? <></> :
                <>
                    <div className="h-36 relative">
                        <img className="h-36 w-screen object-none -scale-x-1" src={selectedService.background}/>
                        <h1 className="absolute w-10 m-0 bottom-1 text-3xl font-bold px-3 header-1 text-secondary font-verdana">{selectedService.title.toUpperCase()}</h1>
                    </div>
                    { service.element? service.element : <></> }
                    <div className="mt-auto fixed bottom-0">
                        <div className="bg-white border border-primary flex text-primary text-xs text-center p-2 rounded-t-lg">
                            <h3 className="text-xl font-black flex items-center">Total cost:</h3>
                            <div className="flex flex-col ml-auto">
                                <p className="text-2xl font-black">₱{Number(serviceDetails.totalCost).toLocaleString('en-PH')}</p>
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