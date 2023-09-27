import Header from "@/Main Components/Header";
import { Button } from "@/components/ui/button";
import homeowner from "../assets/images/homeowner.png"
import housemates from "../assets/images/housemates.png"

interface SignupPageProps {
    userType: string;
}

export default function SignupPage(props:SignupPageProps){
    const { userType } = props
    return(
        <div className="h-screen flex flex-col">
            <Header />
            <div className="mt-4 flex flex-col p-4 items-center border-2 grow">
                <h3 className={`font-bold text-xl ${userType === 'Homeowner' ? 'text-primary' : 'text-secondary'}`}>Sign Up as a {userType}</h3>
                <img src={userType === 'Homeowner' ? homeowner : housemates}/>
            </div>
            <Button className={`page-action-button text-white border-none rounded-none ${userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary'}`}>Sign Up</Button>
        </div>
    )
}