import { Button } from "@/components/ui/button"
import generalCleaning from "../assets/images/generalCleaning.png"
import beautyAndSpa from "../assets/images/beauty&Spa.png"
import painting from "../assets/images/painting.png"
import plumbing from "../assets/images/plumbing.png"
import driver from "../assets/images/driver.png"
import aircon from "../assets/images/aircon.png"
import babySitting from "../assets/images/babySitting.png"
import dogGroomer from "../assets/images/dogGroomer.png"
import dogWalker from "../assets/images/dogWalker.png"
import familyCare from "../assets/images/familyCare.png"
import gardening from "../assets/images/gardening.png"
import dogSitting from "../assets/images/dogSitting.png"
import { useEffect, useState } from "react"
import { AxiosInstance } from "axios"

interface ServiceSelectionProps {
    userType: string,
    selectionType: 'single' | 'multiple',
    outputData: any,
    setOutputData: Function,
    api: AxiosInstance
}

type Services = {
    id: number,
    title: string,
    serviceName: string,
    icon: string
}

type ServiceData = {
    id: number,
    title: string,
    price: string
}

export default function ServiceSelection(props: ServiceSelectionProps){
    const { userType, selectionType, outputData, setOutputData, api } = props
    const [ services, setServices ] = useState<Array<Services>>([])

    useEffect(()=>{
        getServicesData()
    },[])

    const getServicesData = async () => {
        try {
            const res = await api.get("api/v1/services")

            console.log(res)
            const service_data = res.data.data

            if(res.status === 200){
                const merged_services = service_data.map((service:ServiceData, index:number)=>(
                    { ...service, price: Number(service.price) ,...additional_service_details[index]}
                ))
                console.log(merged_services)
                setServices(merged_services)
            } else {
                console.log(res)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const additional_service_details = [
        { serviceName: "General Cleaning", icon: generalCleaning },
        { serviceName: "Beauty & Spa", icon: beautyAndSpa },
        { serviceName: "Painting", icon: painting },
        { serviceName: "Plumbing", icon: plumbing },
        { serviceName: "Aircon Services", icon: aircon },
        { serviceName: "Driver", icon: driver },
        { serviceName: "Gardening", icon: gardening },
        { serviceName: "Babysitting", icon: babySitting },
        { serviceName: "Family Care", icon: familyCare },
        { serviceName: "Dog Walker", icon: dogWalker },
        { serviceName: "Dog Groomer", icon: dogGroomer },
        { serviceName: "Dog Sitter", icon: dogSitting }
    ]

    const handleClick = (service:object) => {
        if(selectionType === 'single') {
            setOutputData(service)
        } else {
            console.log(service + " is clicked!")
            if (outputData.includes(service)) {
                setOutputData(outputData.filter((item:any) => item.id !== service));
            } else {
                setOutputData([...outputData, service]);
            }
        }
    }

    return(
        <div className="grow grid grid-cols-3 gap-3">
            {
                services.map((service: Services)=>{
                    return(
                        <Button key={service.serviceName} 
                            className={`${selectionType === "single" ? '' : outputData.some((data:any)=> data.id === service.id) ? userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary' : '' } p-1 h-28 flex flex-col justify-start shadow-shadow ${userType === 'Homeowner' ? 'border-primary' : 'border-secondary'}`}
                            onClick={()=>handleClick(service)}    
                        >
                            <h3 className="text-xs font-bold">{service.serviceName}</h3>
                            <img src={service.icon} className="mt-auto h-[4.5rem]"/>
                        </Button>
                    )
                })
            }
        </div>
    )
}