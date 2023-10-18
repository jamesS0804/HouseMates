import excellentPerson from "../assets/icons/excellentPerson.png"
import cleaningMaterials from "../assets/icons/cleaningMaterials.png"
import checkedBox from "../assets/icons/checkedBox.png"
import checkedShield from "../assets/icons/checkedShield.png"
import clean from "../assets/icons/clean.png"
import instaChecked from "../assets/icons/instaChecked.png"
import people from "../assets/icons/people.png"
import popular from "../assets/icons/popular.png"
import generalCleaningBG from "../assets/images/generalCleaningBG.png"
import airconServicesBG from "../assets/images/airconServicesBG.png"
import plumbingBG from "../assets/images/plumbingBG.png"
import defaultBG from "../assets/images/housemates.png"
import { Button } from "@/components/ui/button"
import BackButton from "@/Main Components/BackButton"
import { Link } from "react-router-dom"
import { useEffect } from "react"

interface ServiceMainPage {
    selectedService: SelectedService
    setSelectedService: Function
    navigate: Function
    serviceDetails: object
    setServiceDetails: Function
}

type SelectedService = {
    id: number
    title: string
    price: number
    serviceName: string
    icon: string
    background: string
}

type ServiceDescriptionItem = {
    title: string
    icon: any
    description: string
};

type BasicServiceDescriptions = ServiceDescriptionItem[];

type ServiceDescription = {
    background: string
    descriptions: BasicServiceDescriptions
};

type Services = {
    [serviceName: string]: ServiceDescription
};

export default function ServiceMainPage(props: ServiceMainPage) {
    const { selectedService, setSelectedService, navigate, serviceDetails, setServiceDetails } = props

    const basicServiceDescriptions: BasicServiceDescriptions = [
        { title: 'Service Details', icon: excellentPerson, description: "HouseMates cleaners clean your unit including bedrooms, bathrooms, and common areas. Our cleaners all work directly with Housemates and are loved by our users." },
        { title: 'Materials', icon: cleaningMaterials, description: "HouseMates cleaners come fully prepared with everything they need to clean your home. We use top-quality cleaning materials from international and local brands. The cleaner also brings a small vacuum ahe can use for sofas and rugs. We’ll leave your home looking great and smelling fresh!" },
        { title: 'Service Pro', icon: checkedBox, description: "Our cleaners are the best in the city! We carefully vet and select all of our cleaners, and each cleaner works directly to Housemates. All Housemates cleaners have passed our quality standard, and follows our performance guidelines." },
        { title: 'Safety', icon: checkedShield, description: "Our cleaners wear proper uniform throughout the service and can present Covid- 19 vaccination certificates upon request." }
    ]
    const services: Services = {
        'General Cleaning': {
          background: generalCleaningBG,
          descriptions: basicServiceDescriptions,
        },
        'Aircon Services': {
          background: airconServicesBG,
          descriptions: basicServiceDescriptions,
        },
        'Plumbing': {
          background: plumbingBG,
          descriptions: basicServiceDescriptions,
        },
        'Beauty & Spa': {
          background: defaultBG,
          descriptions: basicServiceDescriptions,
        },
        'Painting': {
          background: defaultBG,
          descriptions: basicServiceDescriptions,
        },
        'Driver': {
          background: defaultBG,
          descriptions: basicServiceDescriptions,
        },
        'Gardening': {
          background: defaultBG,
          descriptions: basicServiceDescriptions,
        },
        'Babysitting': {
          background: defaultBG,
          descriptions: basicServiceDescriptions,
        },
        'Family Care': {
          background: defaultBG,
          descriptions: basicServiceDescriptions,
        },
        'Dog Walker': {
          background: defaultBG,
          descriptions: basicServiceDescriptions,
        },
        'Dog Groomer': {
          background: defaultBG,
          descriptions: basicServiceDescriptions,
        },
        'Dog Sitter': {
          background: defaultBG,
          descriptions: basicServiceDescriptions,
        },
    };
    const service = Object.assign({ ...selectedService, ...services[selectedService.serviceName] })

    useEffect(()=>{
        setSelectedService(service)
        setServiceDetails({ service: {}, data: {}, totalCost: 0, date: "", time: { $H: "", $m: "" } })
    },[])

    useEffect(()=>{
        setServiceDetails({ ...serviceDetails, service: service })
    },[selectedService])

    return (
        <div className="h-screen flex flex-col relative">
            <BackButton setSelectedService={setSelectedService} navigate={navigate}/>
            {
                Object.keys(selectedService).length === 0 ? <></> :
                <>
                    <div className="h-56 relative">
                        {
                            service.background === defaultBG ? 
                                <img className="h-56 w-screen object-right object-scale-down bg-primarySelected" src={service.icon}/>
                                :
                                <img className="h-56 w-screen object-cover" src={service.background}/>
                        }
                        <h1 className="absolute w-10 m-0 bottom-1 text-3xl font-bold px-3 text-secondary font-verdana header-1">{selectedService.title.toUpperCase()}</h1>
                    </div>
                    <div className="p-3 flex flex-col gap-7 pb-28">
                        <div className="border p-3 flex border-primary rounded-xl shadow-shadow gap-2">
                            <div>
                                <h3 className="text-primary font-black">{selectedService.title}</h3>
                                <h3 className="text-secondary font-semibold">Starts at <span className="text-lg font-[1000]">₱{selectedService.price}</span></h3>
                                <p className="text-xs">All cleaning materials included</p>
                            </div>
                            <div className="text-[0.55rem] flex flex-col gap-1">
                                <div className="flex gap-1 items-center">
                                    <img className="h-4" src={popular}/>
                                    <p>3.8 rating</p>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <img className="h-4" src={people}/>
                                    <p>2,300+ served</p>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <img className="h-4" src={clean}/>
                                    <p>Covid-19 vaccinated</p>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <img className="h-4" src={instaChecked}/>
                                    <p>HouseMates Certified</p>
                                </div>
                            </div>
                        </div>
                        <div className="border border-primary shadow-shadow flex flex-col gap-4 p-3 rounded-xl">
                            {
                                service.descriptions.map((description: any) => {
                                    return (
                                        <div key={description.title} className="flex flex-col">
                                            <div className="flex gap-1 items-center">
                                                <img className="h-6" src={description.icon} />
                                                <h3 className="font-bold text-primary">{description.title}</h3>
                                            </div>
                                            <p className="text-xs">{description.description}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="mt-auto fixed bottom-0">
                        <div className="bg-white border font-semibold border-primary text-primary text-xs text-center p-2 rounded-t-lg">Next: Customize your {selectedService.title}</div>
                        <Link to="/services/variations">
                            <Button className="w-screen rounded-none bg-primary border-none font-bold text-white text-lg">Next</Button>
                        </Link>
                    </div>
                </>
            }
        </div>
    )
}