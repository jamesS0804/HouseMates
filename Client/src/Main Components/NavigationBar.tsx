import homeIcon from "../assets/icons/homeIcon.png"
import bookingsIcon from "../assets/icons/bookingsIcon.png"
import messagesIcon from "../assets/icons/messagesIcon.png"
import profileIcon from "../assets/icons/profileIcon.png"
import { Link } from "react-router-dom"

interface NavigationBar {
    userType: string,
    selectedOption?: string
}

export default function NavigationBar(props:NavigationBar) {
    const { userType, selectedOption } = props
    const navigationOptions = [
        {title: 'Home', image: homeIcon, path: "/home"},
        {title: 'Bookings', image: bookingsIcon, path: "/bookings"},
        {title: 'Messages', image: messagesIcon, path: "/messages"},
        {title: 'Profile', image: profileIcon, path: "/profile"},
    ]
    return(
        <div className={`w-screen fixed bottom-0 left-0 p-0 grid grid-cols-4 gap-0 text-white ${userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary'}`}>
            {
                navigationOptions.map((option)=>{
                    return(
                        <Link key={option.title} type="button" to={option.path} className={`grow py-3 px-5 flex flex-col justify-center items-center ${selectedOption === option.title.toLocaleLowerCase() ? userType === 'Homeowner' ? 'bg-primarySelected' : 'bg-secondarySelected' : ''}`}>
                            <img className="w-8 h-8" src={option.image} />
                            <p className="text-xs">{option.title}</p>
                        </Link>
                    )
                })
            }
        </div>
    )
}