import Header from "@/Main Components/Header"
import { Button } from "@/components/ui/button"
import housemates from "../assets/images/housemates.png"
import { Link } from "react-router-dom"

export default function GetStartedPage() {
    return(
        <div className="h-screen flex flex-col">
            <div className="mb-[8rem]" />
            <Header />
            <div className="w-full mt-[12rem] p-4">
                <div className="relative h-[6.56rem] w-full rounded-xl bg-[#E6BB76]">
                    <img className="absolute top-[-100%] m-auto left-0 right-0 h-50 w-[50%]" src={housemates}/>
                    <div className="absolute top-[-1.25rem] flex w-full">
                        <p className="mr-auto text-sm font-bold">What can we</p>
                        <p className="ml-auto text-sm font-bold">help you with?</p>
                    </div>
                </div>
            </div>
            <Link type="button" to="/entry" className="w-full mt-auto">
                <Button className='bg-primary text-white text-lg w-full mt-auto border-none rounded-none'>GET STARTED</Button>
            </Link>
        </div>
    )
}