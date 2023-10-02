import Header from "@/Main Components/Header"
import SubHeader from "@/Main Components/SubHeader"
import { Button } from "@/components/ui/button"

import { Link } from "react-router-dom"

export default function GetStartedPage() {
    return(
        <div className="h-screen flex flex-col">
            <div className="mb-[8rem]" />
            <Header />
            <SubHeader />
            <Link type="button" to="/entry" className="w-full mt-auto">
                <Button className='bg-primary text-white text-lg w-full mt-auto border-none rounded-none'>GET STARTED</Button>
            </Link>
        </div>
    )
}