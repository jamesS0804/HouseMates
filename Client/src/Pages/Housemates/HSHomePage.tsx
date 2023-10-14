import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import authenticated_api from "@/utils/authenticated_api"
import LoadingPage from "../LoadingPage"

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
        console.log(actionIsLoading)
        if(actionIsLoading) checkForPendingJob()
    },[])

    const checkForPendingJob = async () => {
        console.log("checking for pending job")
        setActionIsLoading(true)
        try {
            const res = await authenticated_api.get(`api/v1/bookings/${currentUser.id}`)
            console.log(res)
            if(res.status === 200) {
                const jsonResponse = res.data.data
                console.log(res)
                console.log(jsonResponse)
                setPendingJobs(jsonResponse)
            } else {
                console.log(res)
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

    const respondToPendingJob = async (response: string) => {
        console.log(response)
        // try {
        //     const res = await authenticated_api.patch(`api/v1/${currentUser.id}`)
        // } catch (error) {
        //     console.log(error)
        // }
    }

    useEffect(()=>{
        setPendingJobs(pendingJobs)
        updateIsActive()
    },[switchValue])

    return(
        <div className="flex flex-col p-4 gap-4">
            {
                actionIsLoading ? 
                    <LoadingPage />
                    :
                    <>
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
                                <h3 className="text-secondary font-bold">Pending Jobs</h3>
                                {
                                    pendingJobs.length === 0 ? 
                                        <p className="text-xs">You have no pending jobs, set yourself as <span className="font-black">active</span> to get started 
                                        and receive pending requests!</p>
                                        :
                                        <p className="text-xs">You have a service request!</p>
                                }
                            </div>
                            <hr className="border-1 border-secondary w-full mb-3"></hr>
                            {
                                pendingJobs.length === 0 ?
                                    <></>
                                    :
                                    pendingJobs.map((pendingJob:any)=>{
                                        return(
                                            <div className="w-full">
                                                <div>
                                                        <div>{pendingJob.name}</div>
                                                        <div>{pendingJob.address}</div>
                                                        <div>{pendingJob.details}</div>
                                                        <div>{pendingJob.subtotal}</div>
                                                        <div>{pendingJob.total}</div>
                                                </div>
                                                <div className="flex w-full border-t-2 border-secondary">
                                                        <Button onClick={()=> respondToPendingJob("ACCEPTED")} className="grow font-black text-white bg-secondary rounded-none rounded-bl-xl border-none">Accept</Button>
                                                        <Button onClick={()=> respondToPendingJob("REJECTED")} className="grow font-black text-white bg-secondary rounded-none rounded-br-xl border-none">Decline</Button>
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
                    </>
            }
        </div>
    )
}