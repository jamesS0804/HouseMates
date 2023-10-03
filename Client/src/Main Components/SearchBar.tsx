import { Input } from "@/components/ui/input"
import searchIcon from "../assets/icons/searchIcon.png"

export default function SearchBar() {
    return (
        <div className="h-100 w-100 relative">
            <img className="h-6 absolute top-2 left-1" src={searchIcon} />
            <Input className="pl-7 border-primary shadow-shadow" type="text" placeholder="Search..." />
        </div>
    )
}