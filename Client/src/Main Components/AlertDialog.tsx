import { Button } from "@/components/ui/button"
import disconnected from "../assets/images/disconnected.png"

interface AlertDialogProps {
    show : boolean
}

export default function AlertDialog(props:AlertDialogProps) {
    const { show  } = props
    
    const handleSessionExpiry = () => {
        sessionStorage.clear()
        window.location.reload()
    }

    return(
        <div className={`${show ? 'block' : 'hidden'} absolute flex justify-center items-center w-screen h-screen p-4 z-30 backdrop-blur-sm`}>
            <div className="flex flex-col items-center bg-white border px-3 py-6 gap-6 shadow rounded-xl w-80">
                <img className="w-2/3" src={disconnected} />
                <div className="text-center font-black flex flex-col gap-2">
                    <div>Your session has expired.</div>
                    <div>Please login again.</div>
                </div>
                <Button onClick={handleSessionExpiry} className="font-black w-full bg-black text-white">Take me to home</Button>
            </div>
        </div>
    )
}