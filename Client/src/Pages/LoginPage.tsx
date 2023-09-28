import Header from "@/Main Components/Header"
import { Button } from "@/components/ui/button"

interface LoginPageProps {
    userType: string
}

export default function LoginPage(props:LoginPageProps){
    const { userType } = props
    return(
        <div className="h-screen flex flex-col">
            <Header />
            <div>
                <h3>
                    
                </h3>
            </div>
            <Button
                className={`page-action-button text-white border-none rounded-none ${userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary'}`}
            >Login</Button>
        </div>
    )
}