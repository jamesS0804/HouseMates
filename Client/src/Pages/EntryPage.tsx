import Header from "@/Main Components/Header"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import housemates from "../assets/images/housemates.png"
import homeowner from "../assets/images/homeowner.png"
import { useEffect, useState } from "react"

export default function EntryPage() {
    const [ userType,setUserType ] = useState('homeowner')
    useEffect(()=>{
        console.log(userType)
    },[userType])
    const handleClick = (type: string) => {
        setUserType(type)
    }
    return(
        <div className="h-screen flex flex-col">
            <Header />
            <div className="grow p-10 flex flex-col gap-4">
                <Button onClick={()=> handleClick('homeowner')} className="h-auto flex flex-col gap-4 border-primary hover:bg-primary shadow-shadow">
                    <p className="font-bold text-xl">Are you a Homeowner?</p>
                    <img className="h-[12rem]" src={homeowner}/>
                </Button>
                <Button onClick={()=> handleClick('housemate')} className="h-auto flex flex-col gap-4 border-secondary hover:bg-secondary shadow-shadow">
                    <p className="font-bold text-xl">Are you a Housemate?</p>
                    <img className="h-[12rem]" src={housemates}/>
                </Button>
            </div>
            <Link type="button" to="/signup">
                <Button className={`bg-${userType === 'homeowner' ? 'primary' : 'secondary'} text-white border-none text-lg w-full mt-auto rounded-none`}>GET STARTED</Button>
            </Link>
        </div>
    )
}