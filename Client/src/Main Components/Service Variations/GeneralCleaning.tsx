import { Button } from "@/components/ui/button";
import condo from "../../assets/images/Service Variations/General Cleaning/condo.png"
import house from "../../assets/images/Service Variations/General Cleaning/house.png"
import disinfectantSpray from "../../assets/images/Service Variations/General Cleaning/disinfectantSpray.png"
import dishAndSoap from "../../assets/images/Service Variations/General Cleaning/dishAndSoap.png"
import fan from "../../assets/images/Service Variations/General Cleaning/fan.png"
import fridge from "../../assets/images/Service Variations/General Cleaning/fridge.png"
import washingMachine from "../../assets/images/Service Variations/General Cleaning/washingMachine.png"
import Counter from "../Counter";
import StringIterator from "../StringIterator";
import { useEffect, useState } from "react";
import { AxiosInstance } from "axios";

interface GeneralCleaningProps {
    serviceDetails: Record<string, any>
    setServiceDetails: Function
    api: AxiosInstance
    selectedService: SelectedService
}

type SelectedService = {
    id: number
}

export default function GeneralCleaning(props: GeneralCleaningProps) {
    const { serviceDetails, setServiceDetails, api, selectedService } = props
    
    const [inputData, setInputData] = useState({
        homeType: { type: 'condo', title: 'Condo (20 -60 sqm)', price: 100 },
        numberOfBedroom: { type: 'studio', title: 'Studio Type', price: 99 },
        numberOfBathroom: { type: 'none', title: 'None', price: 0 },
        extraServices: []
    })

    useEffect(() => {
        getSubserviceData()
        setServiceDetails({ ...serviceDetails, data: inputData})
    }, [inputData])
    
    const getSubserviceData = async () => {
        try {
            const res = await api.get(`api/v1/subservices/${selectedService.id}`)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const options = {
        homeType: [
            { type: 'condo', title: "Condo (20 - 60 sqm)", image: condo, price: 100 },
            { type: 'house', title: "House (>60sqm)", image: house, price: 200 }
        ],
        numberOfBedroom: [
            { type: "studio", title: "Studio Type", price: 99 },
            { type: "oneBedroom", title: "1 Bedroom", price: 199 },
            { type: "twoBedroom", title: "2 Bedroom", price: 299 }
        ],
        numberOfBathroom: [
            { type: "none", title: "None", price: 0 },
            { type: "oneBathroom", title: "1 Bathroom", price: 50 },
            { type: "twoBathroom", title: "2 Bathroom", price: 100 }
        ],
        extraServices: [
            {
                type: 'Disinfectant Spraying', image: disinfectantSpray, price: 699, unit: "order",
                description: ["Wiping of all surfaces with disinfectant", "30 mins per order", "Best Seller!"]
            },
            {
                type: 'Dishwashing', image: dishAndSoap, price: 108, unit: "30 mins",
                description: ["Washing of dishes and kitchenware", "Kindly provide the sponge and dishwashing liquid", "Best Seller!"]
            },
            {
                type: 'Electric Fan Cleaning', image: fan, price: 150, unit: "unit(s)",
                description: ["Good for air quality", "Cleaning of fan blade and cage", "Best Seller!"]
            },
            {
                type: 'Fridge Cleaning', image: fridge, price: 150, unit: "unit(s)",
                description: ["Tidying & cleaning of fridge interior", "Defrosting may be requested", "Best Seller!"]
            },
            {
                type: 'Laundry', image: washingMachine, price: 18, unit: "kg",
                description: ["Kindly provide the laundry detergent", "Does not include ironing"]
            }
        ]
    }


    const handleClick = (home: any) => {
        setInputData({ ...inputData, homeType: { type: home.type, title: home.title, price: home.price } })
    }

    return (
        <div className="flex flex-col gap-3 p-2 pb-28">
            <div>
                <div className="font-black">Select the details of your cleaning!</div>
                <div className="text-sm">we save your selection for future bookings.</div>
            </div>
            <div>
                <h3 className="font-black">What is your home type?</h3>
                <div className="flex gap-2 p-2 justify-center">
                    {
                        options.homeType.map((home) => {
                            return (
                                <Button 
                                    key={home.type} 
                                    onClick={() => handleClick(home)} 
                                    className={`flex-1 first-line:flex flex-col h-fit border-primary shadow-shadow ${inputData['homeType'].type === home.type ? 'bg-primary' : ''}`}
                                >
                                    <img src={home.image} className="h-14" />
                                    <p className="font-black text-xs">{home.title}</p>
                                </Button>
                            )
                        })
                    }
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-black">How many bedrooms?</h3>
                        <StringIterator valueType="numberOfBedroom" values={options.numberOfBedroom} inputData={inputData} setInputData={setInputData} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-black">How many bathrooms?</h3>
                        <StringIterator valueType="numberOfBathroom" values={options.numberOfBathroom} inputData={inputData} setInputData={setInputData} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div>
                    <h3 className="font-black text-primarySelected">Extra Cleaning</h3>
                    <p className="text-xs text-primarySelected">Customize your cleaning with optional extra services</p>
                </div>
                <div className="flex flex-col gap-2">
                    {
                        options.extraServices.map((extraService) => {
                            return (
                                <div key={extraService.type} className="relative border border-primary rounded-xl flex gap-4 shadow-shadow w-fill p-1">
                                    <img className="w-20 h-20" src={extraService.image} />
                                    <div className="flex flex-col gap-1">
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-xs font-black">{extraService.type}</h3>
                                            <h3 className="font-black text-secondary">₱{extraService.price}</h3>
                                        </div>
                                        <ul className="flex flex-col gap-1 list-disc">
                                            {
                                                extraService.description.map((description) => {
                                                    return (
                                                        <li key={description} className="text-[calc(0.75rem-3px)]">{description}</li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                    <div className="absolute top-1 left-[calc(100%-105px)] w-1 h-1">
                                        <Counter unit={extraService.unit} valueType="extraServices" value={extraService} inputData={inputData} setInputData={setInputData} />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}