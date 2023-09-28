import Header from "@/Main Components/Header"
import NavigationBar from "@/Main Components/NavigationBar"

interface VerificationPageProps {
    userType: string
}

export default function VerificationPage(props:VerificationPageProps) {
    const { userType } = props
    return(
        <div className="h-screen flex flex-col">
            <Header />
            <div className="mt-auto">
                <NavigationBar userType={userType} />
            </div>
        </div>
    )
}