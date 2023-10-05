import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface CounterProps {
    unit: string
    valueType: string
    value: any
    inputData: any
    setInputData: Function
}

export default function Counter(props: CounterProps){
    const { unit, valueType, value, inputData, setInputData } = props
    const [ inputValue, setInputValue ] = useState(0)

    useEffect(()=>{
        if(inputValue > 0) {
            const found = inputData[valueType].some((item:any)=> item.type === value.type )
            if(found) {
                const updatedData = inputData[valueType].map((item:any)=> item.type === value.type ? { ...item, quantity: inputValue } : item )
                setInputData({ ...inputData, [valueType]: updatedData })
            } else {
                setInputData({ ...inputData, [valueType]: [ ...inputData[valueType], { type: value.type, quantity: inputValue, price: value.price } ] })
            }
        } else {
            setInputData({ ...inputData, [valueType]: inputData[valueType].filter((item:any)=> item.type !== value.type) })
        }
    },[inputValue])

    return(
        <div className="h-min w-min flex justify-center items-center">
            <Button onClick={()=>setInputValue((prevValue)=> prevValue - 1)} className="bg-primary border-primary text-white p-0 h-6 w-6">-</Button>
            <div className="flex flex-col items-center w-12">
                <input readOnly className="font-black h-5 w-5 text-sm text-center bg-transparent whitespace-pre-line" type="text" value={inputValue} />
                <p className="text-[10px]">{unit}</p>
            </div>
            <Button onClick={()=>setInputValue((prevValue)=> prevValue + 1)} className="bg-primary border-primary text-white p-0 h-6 w-6">+</Button>
        </div>
    )
}