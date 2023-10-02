import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export default function HSHomePage(){
    const [ switchValue, setSwitchValue ] = useState(false)
    const [ pendingJobs, setPendingJobs ] = useState([])

    const handleOnChange = () => {
        setSwitchValue(!switchValue)
    }

    return(
        <div className="flex flex-col p-4 gap-4">
            <h2 className="font-black text-xl text-secondary">Welcome, !</h2>
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
                                    <Button className="grow font-black text-white bg-secondary rounded-none rounded-bl-xl border-none">Accept</Button>
                                    <Button className="grow font-black text-white bg-secondary rounded-none rounded-br-xl border-none">Decline</Button>
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
                    <p className="font-black text-2xl">0.00</p>
                </div>
                {/* <div className="relative p-0 m-0">
                    <svg className="absolute top-0 right-0 w-fit h-[132px]" viewBox="0 0 180 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M33.5 16.5C35.2372 6.94519 43.5591 0 53.2705 0H197.6C205.441 0 209.361 0 212.356 1.52591C214.99 2.86814 217.132 5.00986 218.474 7.64413C220 10.6389 220 14.5593 220 22.4V87.6C220 95.4407 220 99.3611 218.474 102.356C217.132 104.99 214.99 107.132 212.356 108.474C209.361 110 205.441 110 197.6 110H0L13 75.5L27.5 34.5L33.5 16.5Z" fill="#CE9354" fillOpacity="0.8"/>
                    </svg>
                </div> */}
                <Button className="bg-secondary border-none mt-4 text-white font-black text-xs w-20 h-6">Send</Button>
            </div>
        </div>
    )
}