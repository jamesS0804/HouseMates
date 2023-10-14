import { Button } from "@/components/ui/button"

interface AlertDialogProps {
    show : boolean
}

export default function AlertDialog(props:AlertDialogProps) {
    const { show  } = props
    return(
        <div className={`${show ? 'block' : 'hidden'}`}>
            <div>Your session has expired. Please login again.</div>
            <Button 
                onClick={()=>{
                            sessionStorage.clear()
                            window.location.reload()
                        }}
            >Take me to home</Button>
        </div>
    )
}