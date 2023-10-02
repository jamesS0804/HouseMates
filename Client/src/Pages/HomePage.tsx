import Header from "@/Main Components/Header"
import NavigationBar from "@/Main Components/NavigationBar"
import SearchBar from "@/Main Components/SearchBar"
import ServiceSelection from "@/Main Components/ServiceSelection"
import SubHeader from "@/Main Components/SubHeader"
import { useEffect, useState } from "react"
import favoriteHousemate from "../assets/images/favoriteHousemates.png"
import news from "../assets/images/news.png"
import discounts from "../assets/images/discount.png"

interface HomePageProps {
    userType: string,
    navigate: Function
}

export default function HomePage(props: HomePageProps) {
    const { userType, navigate } = props
    const [ selectedService, setSelectedService ] = useState("")

    useEffect(()=>{
        console.log('selected service is ' + selectedService )
        // navigate(`/${selectedService}`)
    },[selectedService])

    return(
        <div className="h-screen flex flex-col">
            {
                userType === 'Homeowner' ?
                    <div className="h-full flex flex-col">
                        <Header />
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
                            <ServiceSelection userType={userType} selectionType="single" outputData={selectedService} setOutputData={setSelectedService} />
                        </div>
                    </div>
                    :
                    <div></div>
            }
            <NavigationBar userType={userType} selectedOption="home" />
        </div>
    )
}