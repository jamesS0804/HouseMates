import { Button } from "@/components/ui/button"
import backButton from "../assets/icons/backButton.png"

interface BackButtonProps {
    setSelectedService: Function,
    navigate: Function
}

export default function BackButton(props: BackButtonProps){
    const { setSelectedService, navigate } = props
    const handleClick = () => {
        navigate(-1)
        setSelectedService("")
    }
    return(
        <Button className="absolute top-4 left-1 z-10 border-none h-fit w-fit p-0" onClick={handleClick}>
            <img className="h-8 z-20" src={backButton} />
        </Button>
    )
}