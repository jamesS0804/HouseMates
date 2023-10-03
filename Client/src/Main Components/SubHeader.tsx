import housemates from "../assets/images/housemates.png"

interface SubHeader {
    customStyle?: string
}

export default function SubHeader(props: SubHeader) {
    const { customStyle } = props
    return(
        <div className={`w-full mt-[12rem] p-4 ${customStyle}`}>
            <div className="relative h-[6.56rem] w-full rounded-xl bg-[#E6BB76]">
                <img className="absolute top-[-100%] m-auto left-0 right-0 h-50 w-[50%]" src={housemates}/>
                <div className="absolute top-[-1.25rem] flex w-full">
                    <p className="mr-auto text-sm font-bold">What can we</p>
                    <p className="ml-auto text-sm font-bold">help you with?</p>
                </div>
            </div>
        </div>
    )
}