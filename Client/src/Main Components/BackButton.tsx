import { Button } from "@/components/ui/button"
import backButton from "../assets/icons/backButton.png"

interface BackButtonProps {
    setSelectedService?: Function
    navigate: Function
    redirect?: Function
    redirectValue?: any
}

export default function BackButton(props: BackButtonProps){
    const { setSelectedService, navigate, redirect, redirectValue } = props
    const handleClick = () => {
        if(redirect !== undefined) {
            redirect(redirectValue)
        } else {
            navigate(-1)
        }
        if(setSelectedService) setSelectedService("")
    }
    return(
        <Button className="absolute top-4 left-1 z-10 border-none h-fit w-fit p-0" onClick={handleClick}>
            <img className="h-8 z-20" src={backButton} />
        </Button>
    )
}