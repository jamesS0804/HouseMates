import homeIcon from "../assets/icons/homeIcon.png"
import bookingsIcon from "../assets/icons/bookingsIcon.png"
import messagesIcon from "../assets/icons/messagesIcon.png"
import profileIcon from "../assets/icons/profileIcon.png"
import { Link } from "react-router-dom"

interface NavigationBar {
    userType: string
}

export default function NavigationBar(props:NavigationBar) {
    const { userType } = props
    return(
        <div className={`w-screen fixed bottom-0 left-0 p-1 px-6 flex justify-between text-white ${userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary'}`}>
            <Link type="button" to={"/home"} className="p-2 flex flex-col justify-center items-center">
                <img className="w-8 h-8" src={homeIcon} />
                <p className="text-xs">Home</p>
            </Link>
            <Link type="button" to={"/bookings"} className="p-2 flex flex-col justify-center items-center">
                <img className="w-8 h-8" src={bookingsIcon} />
                <p className="text-xs">Bookings</p>
            </Link>
            <Link type="button" to={"/messages"} className="p-2 flex flex-col justify-center items-center">
                <img className="w-8 h-8" src={messagesIcon} />
                <p className="text-xs">Messages</p>
            </Link>
            <Link type="button" to={"/profile"} className="p-2 flex flex-col justify-center items-center">
                <img className="w-8 h-8" src={profileIcon} />
                <p className="text-xs">Profile</p>
            </Link>
        </div>
    )
}