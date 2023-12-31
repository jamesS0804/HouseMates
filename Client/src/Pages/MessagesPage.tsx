import BackButton from "@/Main Components/BackButton"
import NavigationBar from "@/Main Components/NavigationBar"
import { useState } from "react"

interface MessagesPageProps {
    userType: string,
    navigate: Function
}

export default function MessagesPage(props: MessagesPageProps) {
    const { userType, navigate } = props
    const [ messages, setMessages ] = useState([])
    return(
        <div className="h-screen flex flex-col items-center">
            <BackButton navigate={navigate} />
            <div className={`flex flex-col items-center w-full ${userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary'}`}>
                <h1 className="my-4 font-verdana text-[#EBCE9F] font-black">My Messages</h1>
            </div>
            <div className="flex-1 h-full w-screen flex flex-col items-center justify-center">
                {
                    messages.length === 0 ? <h3 className="text-gray-500">You have no messages</h3>
                        :
                        messages.map((message:object)=>{
                            return(
                                <div></div>
                            )
                        })
                }
            </div>
            <NavigationBar userType={userType} selectedOption="messages" />
        </div>
    )
}