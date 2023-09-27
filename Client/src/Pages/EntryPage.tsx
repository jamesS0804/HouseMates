import Header from "@/Main Components/Header"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import housemates from "../assets/images/housemates.png"
import homeowner from "../assets/images/homeowner.png"

export default function EntryPage() {
    return(
        <div className="h-screen flex flex-col">
            <Header />
            <div className="grow p-10 flex flex-col gap-4">
                <Button className="h-auto flex flex-col gap-4 border-primary hover:bg-primary shadow-shadow">
                    <p className="font-bold text-xl">Are you a Homeowner?</p>
                    <img className="h-[12rem]" src={homeowner}/>
                </Button>
                <Button className="h-auto flex flex-col gap-4 border-secondary hover:bg-secondary shadow-shadow">
                    <p className="font-bold text-xl">Are you a Housemate?</p>
                    <img className="h-[12rem]" src={housemates}/>
                </Button>
            </div>
            <Link type="button" to="/entry">
                <Button className='bg-primary text-white border-none text-lg w-full mt-auto rounded-none'>GET STARTED</Button>
            </Link>
        </div>
    )
}