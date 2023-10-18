import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useEffect, useLayoutEffect, useState } from "react"
import authenticated_api from "@/utils/authenticated_api"
import LoadingPage from "../LoadingPage"
import addressPin from "../../assets/icons/addressPin.png"
import calendar from "../../assets/icons/calendar.png"
import home from "../../assets/icons/home.png"
import bed from "../../assets/icons/bed.png"
import clock from "../../assets/icons/clock.png"
import bathtub from "../../assets/icons/bathtub.png"
import cash from "../../assets/icons/cash.png"

interface HSHomePageProps {
    currentUser: any
    setAlert: Function
    actionIsLoading: boolean
    setActionIsLoading: Function
}

export default function HSHomePage(props:HSHomePageProps){
    const { currentUser, setAlert, actionIsLoading, setActionIsLoading } = props
    const storedSessionData = sessionStorage.getItem('isActive')
    const [ switchValue, setSwitchValue ] = useState(()=> storedSessionData ? JSON.parse(storedSessionData) : false )
    const [ pendingJobs, setPendingJobs ] = useState([])

    useEffect(()=>{
        checkForPendingJob()
    },[])

    useLayoutEffect(()=>{
        setPendingJobs(pendingJobs)
    },[actionIsLoading])

    const checkForPendingJob = async () => {
        setActionIsLoading(true)
        try {
            const res = await authenticated_api.get(`api/v1/bookings/${currentUser.id}`)
            if(res.status === 200) {
                const jsonResponse = res.data.data
                const pendingJobs = jsonResponse.filter((item:any)=>{
                    if(item.status === 'PENDING') return item
                })
                setPendingJobs(pendingJobs)
            }
        } catch (error) {
            console.log(error)
        }
        setActionIsLoading(false)
    }

    const handleOnChange = () => {
        sessionStorage.setItem('isActive', JSON.stringify(!switchValue))
        setSwitchValue(!switchValue)
    }

    const updateIsActive = async () => {
        try {
            const res = await authenticated_api.patch(`api/v1/housemates/${currentUser.id}`,
                {
                    housemate: {
                        is_active: switchValue
                    }
                }
            )
            if(res.status === 200) {
                // setAlert({ status: "SUCCESS", message: res?.data?.data?.message || `You have set yourself as ${switchValue ? 'Active' : 'Inactive'}` })
            } else {
                setAlert({ status: "WARNING", message: res?.data?.data?.message || "Something's not quite right." })
            }
        } catch (error:any) {
            setAlert({ status: "ERROR", message: error?.response?.data?.status.message || "Something went wrong." })
        }
    }

    const respondToPendingJob = async (response: string, bookingId: number, homeownerId: number) => {
        try {
            const res = await authenticated_api.patch(`api/v1/bookings/${bookingId}`, 
            {
                booking: {
                    status: response,
                    homeowner_id: homeownerId,
                    housemate_id: currentUser.id
                }    
            })
            if(res.status === 200){
                checkForPendingJob()
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        setPendingJobs(pendingJobs)
        updateIsActive()
    },[switchValue])

    return(
        <div>
            {
                actionIsLoading ? 
                    <LoadingPage />
                    :
                    <div className="pb-24 flex flex-col p-4 gap-4">
                        <h2 className="font-black text-xl text-secondary">Welcome, {currentUser.name}!</h2>
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={switchValue} 
                                onCheckedChange={handleOnChange}
                                className="border-secondary"
                            />
                            <p className="text-secondary">You are {switchValue ? 'active' : 'inactive'}</p>
                        </div>
                        <div className="border border-secondary rounded-2xl flex flex-col gap-2">
                            <div className="p-3">
                                <h3 className="text-secondary font-bold">Pending Job</h3>
                                {
                                    pendingJobs.length === 0 || pendingJobs[0] === undefined ? 
                                        <p className="text-xs">You have no pending job, set yourself as <span className="font-black">active</span> to get started 
                                        and receive pending requests!</p>
                                        :
                                        <p className="text-xs">You have a service request!</p>
                                }
                            </div>
                            <hr className="border-1 border-secondary w-full mb-3"></hr>
                            {
                                pendingJobs.length === 0 || pendingJobs[0] === undefined ?
                                    <></>
                                    :
                                    pendingJobs.map((pendingJob:any)=>{
                                        const address = pendingJob.address
                                        const addressLine1 = address.address_line_1
                                        const barangay = address.barangay
                                        const city = address.city
                                        const province = address.province
                                        const zipCode = address.zip_code

                                        const dateString = pendingJob.scheduled_at;
                                        const dateObject = new Date(dateString);

                                        const options: any = {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true
                                        };
                                        const categorizedByServiceType:any = {}
                                        pendingJob.service_details.forEach((subservice:any)=>{
                                            if (!categorizedByServiceType[subservice.category]) {
                                                categorizedByServiceType[subservice.category] = [];
                                            }
                                            categorizedByServiceType[subservice.category].push({subservice});
                                        })
                                        const formattedDate = dateObject.toLocaleDateString("en-US", options);
                                        return(
                                            <div key={pendingJob.id} className="h-full w-full rounded-xl flex flex-col items-center justify-center gap-3" >
                                                <div className="flex flex-col w-full gap-2 p-3 pt-0">
                                                    <h3 className="font-black text-lg">{pendingJob.homeowner.name}</h3>
                                                    <div className="flex gap-2 justify-center items-center">
                                                        <img className="w-10" src={addressPin} />
                                                        <p className="text-xs">{`${addressLine1} ${barangay}, ${city}, ${province}, ${zipCode}`}</p>
                                                    </div>
                                                    <div className="border border-secondary w-full" />
                                                    <div className="w-full flex flex-col items-start gap-2">
                                                        <h3 className="font-black mt-2">Service Details</h3>
                                                        <div className="flex gap-2 w-full justify-start items-center">
                                                            <img className="w-8" src={home}/>
                                                            <p className="text-sm">{categorizedByServiceType['Home Type'][0]['subservice'].title}</p>
                                                        </div>
                                                        <div className="flex gap-2 w-full justify-start items-center">
                                                            <img className="w-8" src={bed}/>
                                                            <p className="text-sm">{categorizedByServiceType['Room Type'][0]['subservice'].title}</p>
                                                        </div>
                                                        <div className="flex gap-2 w-full justify-start items-center">
                                                            <img className="w-8" src={bathtub}/>
                                                            <p className="text-sm">{categorizedByServiceType['Bathroom Count'][0]['subservice'].title}</p>
                                                        </div>
                                                        <div className="flex gap-2 w-full justify-start items-center">
                                                            <img className="w-8" src={clock}/>
                                                            <p className="text-sm">2 hours, 15 minutes</p>
                                                        </div>
                                                        <div className="flex gap-2 w-full justify-start items-center">
                                                            <img className="w-8" src={calendar}/>
                                                            <p className="text-sm">{formattedDate}</p>
                                                        </div>
                                                        <h3 className="font-black mt-3">Extra Service/s</h3>
                                                        <ul className={`flex flex-col gap-1 w-full list-disc ${pendingJob.service_details.length === 0 ? '': 'pl-8'}`}>
                                                            {
                                                                categorizedByServiceType['Extra Service'].length === 0 ? 
                                                                    <p className="w-full text-center">No extra service availed.</p>
                                                                    :
                                                                    categorizedByServiceType['Extra Service'].map((item:any)=>{
                                                                            return(
                                                                                <li key={item.subservice.subservice_id}>
                                                                                    {`${item.subservice.quantity} order of ${item.subservice.title}`}
                                                                                </li>
                                                                            ) 
                                                                    }) 
                                                            }
                                                        </ul>
                                                        <div className="border border-secondary w-full" />
                                                        <div className="p-2 flex flex-col gap-2">
                                                            <div className="flex flex-col gap-2">
                                                                <p>Payment Method</p>
                                                                <div className="flex gap-2 items-center">
                                                                    <img className="w-8" src={cash} />
                                                                    <p>{pendingJob.payment_method}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="border border-secondary w-full" />
                                                        <div className="flex w-full mt-10 text-xl">
                                                            <div className="font-black">Total:</div>
                                                            <div className="ml-auto font-black">₱{Number(pendingJob.total_cost).toLocaleString('en-PH')}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex w-full border-t-2 border-secondary">
                                                        <Button onClick={()=> respondToPendingJob("ACCEPTED", pendingJob.id, pendingJob.homeowner.id)} className="grow font-black text-white bg-secondary rounded-none rounded-bl-xl border-t-0 border-l-0 border-b-0 border-r-secondarySelected">Accept</Button>
                                                        <Button onClick={()=> respondToPendingJob("REJECTED", pendingJob.id, pendingJob.homeowner.id)} className="grow font-black text-white bg-secondary rounded-none rounded-br-xl border-none">Decline</Button>
                                                </div>
                                            </div>
                                    )
                                })
                            }
                        </div>
                        <div className="relative flex flex-col gap-2 border border-secondary rounded-2xl p-3">
                            <h3 className="text-secondary font-black">Credit Wallet <span>Balance</span></h3>
                            <div className="flex gap-1">
                                <h3 className="font-bold">PHP</h3>
                                <p className="font-black text-2xl">
                                    {Number(currentUser.balance).toLocaleString('en-PH')
                                    }</p>
                            </div>
                            <Button className="bg-secondary border-none mt-4 text-white font-black text-xs w-20 h-6">Send</Button>
                        </div>
                    </div>
            }
        </div>
    )
}