import extractDataFromDate from "@/utils/extractDataFromDate"
import baththub from "../../assets/icons/bathtub.png"
import bed from "../../assets/icons/bed.png"
import calendar from "../../assets/icons/calendar.png"
import clock from "../../assets/icons/clock.png"
import home from "../../assets/icons/home.png"

interface GeneralCleaningBookingDetailsProps {
    serviceDetails: any
}

export default function GeneralCleaningBookingDetails(props: GeneralCleaningBookingDetailsProps){
    const { serviceDetails } = props
    const day = extractDataFromDate(serviceDetails.date, "day")
    const month = extractDataFromDate(serviceDetails.date, "month")
    const date = extractDataFromDate(serviceDetails.date, "date")
    const hour = serviceDetails.time.$H
    const minute = serviceDetails.time.$m
    return(
        <>
            <h3 className="font-black text-primary">Booking Details</h3>
            <div className="flex gap-2">
                <img className="h-5" src={home} />
                <p className="text-sm">{serviceDetails.data['Home Type'].title}</p>
            </div>
            <div className="flex gap-2">
                <img className="h-5" src={bed} />
                <p className="text-sm">{serviceDetails.data['Room Type'].title}</p>
            </div>
            <div className="flex gap-2">
                <img className="h-5" src={baththub} />
                <p className="text-sm">{serviceDetails.data['Bathroom Count'].title}</p>
            </div>
            <div className="flex gap-2">
                <img className="h-5" src={clock} />
                <p className="text-sm">2 hours, 15 minutes cleaning time</p>
            </div>
            <div className="flex gap-2">
                <img className="h-5" src={calendar} />
                <p className="text-sm">{`${day}, ${month} ${date} ( ${hour}:${minute} ${ hour < 12 ? 'AM' : 'PM' } )`}</p>
            </div>
        </>
    )
}