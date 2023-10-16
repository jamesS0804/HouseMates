import housematesBrand from "../assets/images/housemateBrand.png"

export default function LoadingPage(){
    return(
        <div className="absolute top-0 left-0 h-screen w-screen flex justify-center items-center flex-col gap-2 bg-white z-30">
            <img className="animate-bounce" src={housematesBrand} />
        </div>
    )
}