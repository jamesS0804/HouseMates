import Header from "@/Main Components/Header"
import { Button } from "@/components/ui/button"
import housemates from "../assets/images/housemates.png"

export default function GetStartedPage() {
    return(
        <div className="h-full border-2 border-red-500">
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
            <Button className='bg-primary font-black text-lg w-full fixed left-0 bottom-0 rounded-none'>GET STARTED</Button>
        </div>
    )
}