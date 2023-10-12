import Header from "@/Main Components/Header"
import NavigationBar from "@/Main Components/NavigationBar"
import SearchBar from "@/Main Components/SearchBar"
import ServiceSelection from "@/Main Components/ServiceSelection"
import SubHeader from "@/Main Components/SubHeader"
import { useEffect } from "react"
import favoriteHousemate from "../assets/images/favoriteHousemates.png"
import news from "../assets/images/news.png"
import discounts from "../assets/images/discount.png"
import HSHomePage from "./Housemates/HSHomePage"
import { AxiosInstance } from "axios"

interface HomePageProps {
    userType: string,
    navigate: Function,
    selectedService: Service,
    setSelectedService: Function,
    api: AxiosInstance
    currentUser: any
}

type Service = {
    id: number,
    title: string,
    serviceName: string,
    price: number,
    icon: string
}

export default function HomePage(props: HomePageProps) {
    const { userType, navigate, selectedService, setSelectedService, api, currentUser } = props

    useEffect(()=>{
        setSelectedService(selectedService)
    },[])

    useEffect(()=>{
        if(selectedService.title) navigate("/services")
    },[selectedService])

    return(
        <div className="h-screen flex flex-col">
            <Header />
            {
                userType === 'Homeowner' ?
                    <div className="h-full flex flex-col">
                        <SubHeader customStyle={`mt-[6rem]`} />
                        <div className="p-4 py-0 flex flex-col gap-4">
                            <SearchBar />
                            <div className="flex justify-center">
                                <div className="flex flex-col items-center text-center gap-2">
                                    <img className="h-14" src={favoriteHousemate} />
                                    <p className="text-xs font-bold">Favorite Housemates</p>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <img className="h-14" src={news} />
                                    <p className="text-xs font-bold">News & Announcements</p>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2">
                                    <img className="h-14" src={discounts} />
                                    <p className="text-xs font-bold">Promos & Discounts</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col gap-2 pb-20">
                            <h3 className="font-bold text-xl">Categories</h3>
                            <ServiceSelection userType={userType} selectionType="single" outputData={selectedService} setOutputData={setSelectedService} api={api} />
                        </div>
                    </div>
                    :
                    <HSHomePage api={api} currentUser={currentUser} />
            }
            <NavigationBar userType={userType} selectedOption="home" />
        </div>
    )
}