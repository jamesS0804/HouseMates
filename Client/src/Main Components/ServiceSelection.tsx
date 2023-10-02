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

interface ServiceSelectionProps {
    userType: string,
    selectionType: 'single' | 'multiple',
    outputData: any,
    setOutputData: Function
}

export default function ServiceSelection(props: ServiceSelectionProps){
    const { userType, selectionType, outputData, setOutputData } = props

    const services = [
        { title: "General Cleaning", image: generalCleaning },
        { title: "Beauty & Spa", image: beautyAndSpa },
        { title: "Painting", image: painting },
        { title: "Plumbing", image: plumbing },
        { title: "Aircon Services", image: aircon },
        { title: "Driver", image: driver },
        { title: "Gardening", image: gardening },
        { title: "Babysitting", image: babySitting },
        { title: "Family Care", image: familyCare },
        { title: "Dog Walker", image: dogWalker },
        { title: "Dog Groomer", image: dogGroomer },
        { title: "Dog Sitter", image: dogSitting }
    ]

    const handleClick = (service:string) => {
        if(selectionType === 'single') {
            setOutputData(service)
        } else {
            console.log(service + " is clicked!")
            if (outputData.includes(service)) {
                setOutputData(outputData.filter((item:string) => item !== service));
            } else {
                setOutputData([...outputData, service]);
            }
        }
    }

    return(
        <div className="grow grid grid-cols-3 gap-3">
            {
                services.map((service)=>{
                    return(
                        <Button key={service.title} 
                            className={`${outputData.includes(service.title) ? userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary' : ''} p-1 h-28 flex flex-col justify-start shadow-shadow ${userType === 'Homeowner' ? 'border-primary' : 'border-secondary'}`}
                            onClick={()=>handleClick(service.title)}    
                        >
                            <h3 className="text-xs font-bold">{service.title}</h3>
                            <img src={service.image} className="mt-auto h-[4.5rem]"/>
                        </Button>
                    )
                })
            }
        </div>
    )
}