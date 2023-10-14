import housematesBrand from "../assets/images/housemateBrand.png"

export default function LoadingPage(){
    return(
        <div className="h-screen w-screen flex justify-center items-center flex-col gap-2">
            <img className="animate-bounce" src={housematesBrand} />
        </div>
    )
}