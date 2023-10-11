import { Button } from "@/components/ui/button";
import Counter from "../Counter";
import StringIterator from "../StringIterator";
import { useEffect, useLayoutEffect, useState } from "react";
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

type CategorizedData = {
    [category: string]: Array<SubserviceItem>;
}

type InputData = {
    [category: string]: any;
}

type SubserviceItem = {
    id: number,
    title: string,
    category: string,
    price: Number,
    service_id: number,
    unit: string,
    image_url: string
}

type Item = {
    id: number,
    title: string,
    category: string,
    price: string,
    service_id: number,
    unit: string,
    image_url: string
}

type ServiceDescription = {
    description: string[];
  };
  
  type ExtraServicesDescriptions = {
    [serviceName: string]: ServiceDescription;
  };

export default function GeneralCleaning(props: GeneralCleaningProps) {
    const { serviceDetails, setServiceDetails, api, selectedService } = props

    const [ subserviceData, setSubserviceData ] = useState([])
    const [ categorizedData, setCategorizedData ] = useState<CategorizedData>({});
    const [ inputData, setInputData ] = useState<InputData>({})

    const getSubserviceData = async () => {
        try {
            const res = await api.get(`api/v1/subservices/${selectedService.id}`)
            const jsonResponse = res.data
            if(res.status === 200){
                setSubserviceData(jsonResponse.data)
            } else {
                console.log(res)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useLayoutEffect(() => {
        getSubserviceData();
      }, []);

    useEffect(() => {
        const updatedCategorizedData: CategorizedData = {};
        subserviceData.forEach((item: Item) => {
        if (!updatedCategorizedData[item.category]) {
            updatedCategorizedData[item.category] = [];
        }
        updatedCategorizedData[item.category].push({ ...item, price: parseFloat(item.price) });
        });
        setCategorizedData(updatedCategorizedData);
        if (updatedCategorizedData['Home Type'] && updatedCategorizedData['Home Type'].length > 0) {
            setInputData({
                'Home Type': updatedCategorizedData['Home Type'][0],
                'Room Type': updatedCategorizedData['Room Type'][0],
                'Bathroom Count': updatedCategorizedData['Bathroom Count'][0],
                'Extra Service': []
        })
        }
    },[subserviceData]);

    useEffect(() => {
        setServiceDetails({ ...serviceDetails, data: inputData})
    }, [inputData])

    const extraServicesDescriptions:ExtraServicesDescriptions = {
        'Disinfecting Spray': {
            description: ["Wiping of all surfaces with disinfectant", "30 mins per order", "Best Seller!"]
        },
        'Dishwashing': {
            description: ["Washing of dishes and kitchenware", "Kindly provide the sponge and dishwashing liquid", "Best Seller!"]
        },
        'Electric Fan Cleaning': {
            description: ["Good for air quality", "Cleaning of fan blade and cage", "Best Seller!"]
        },
        'Fridge Cleaning': {
            description: ["Tidying & cleaning of fridge interior", "Defrosting may be requested", "Best Seller!"]
        },
        'Laundry': {
            description: ["Kindly provide the laundry detergent", "Does not include ironing"]
        }
    }


    const handleClick = (home: any) => {
        setInputData({ ...inputData, 'Home Type': home })
    }

    return (
        <>
            {
                categorizedData &&
                <div className="flex flex-col gap-3 p-2 pb-28">
            <div>
                <div className="font-black">Select the details of your cleaning!</div>
                <div className="text-sm">we save your selection for future bookings.</div>
            </div>
            <div>
                <h3 className="font-black">What is your home type?</h3>
                <div className="flex gap-2 p-2 m-0 justify-center">
                    {
                        categorizedData['Home Type'] ?
                            categorizedData['Home Type'].map((home:any) => {
                                return (
                                    <Button 
                                        key={home.id} 
                                        onClick={() => handleClick(home)} 
                                        className={`flex-1 first-line:flex flex-col h-fit border-primary shadow-shadow ${inputData['Home Type'].title === home.title ? 'bg-primary' : ''}`}
                                    >
                                        <img src={home.image_url} className="h-14" />
                                        <p className="font-black text-xs">{home.title}</p>
                                    </Button>
                                )
                            })
                            :
                            <>
                                <div className="h-24 w-full bg-primary animate-pulse rounded-lg" />
                                <div className="h-24 w-full bg-primary animate-pulse rounded-lg" />
                            </>
                    }
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-black">How many bedrooms?</h3>
                        {
                            categorizedData['Room Type'] ? 
                                <StringIterator valueType="Room Type" values={categorizedData['Room Type']} inputData={inputData} setInputData={setInputData} />
                                :
                                <div className="h-6 w-full bg-primary animate-pulse rounded-lg" />
                        }
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-black">How many bathrooms?</h3>
                        {
                            categorizedData['Bathroom Count'] ?
                                <StringIterator valueType="Bathroom Count" values={categorizedData['Bathroom Count']} inputData={inputData} setInputData={setInputData} />
                                :
                                <div className="h-6 w-full bg-primary animate-pulse rounded-lg" />
                        }
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
                        categorizedData['Extra Service'] ?
                            categorizedData['Extra Service'].map((extraService: SubserviceItem) => {
                                return (
                                    <div key={extraService.id} className="relative border border-primary rounded-xl flex gap-4 shadow-shadow w-fill p-1">
                                        <img className="w-20 h-20" src={extraService.image_url} />
                                        <div className="flex flex-col gap-1">
                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-xs font-black">{extraService.title}</h3>
                                                <h3 className="font-black text-secondary">₱{String(extraService.price)}</h3>
                                            </div>
                                            <ul className="flex flex-col gap-1 list-disc">
                                                {
                                                    extraServicesDescriptions[extraService.title].description.map((description:string) => {
                                                        return (
                                                            <li key={description} className="text-[calc(0.75rem-3px)]">{description}</li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                        <div className="absolute top-1 left-[calc(100%-105px)] w-1 h-1">
                                            <Counter unit={extraService.unit} valueType="Extra Service" value={extraService} inputData={inputData} setInputData={setInputData} />
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <>
                                <div className="h-24 w-full bg-primary animate-pulse rounded-lg" />
                                <div className="h-24 w-full bg-primary animate-pulse rounded-lg" />
                                <div className="h-24 w-full bg-primary animate-pulse rounded-lg" />
                            </>
                           
                    }
                </div>
            </div>
        </div>
            }
        </>
    )
}