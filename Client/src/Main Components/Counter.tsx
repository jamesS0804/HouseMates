import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface CounterProps {
    unit: string
    valueType: string
    value: any
    inputData: any
    setInputData: Function
    rootData?: any
}

export default function Counter(props: CounterProps){
    const { unit, valueType, value, inputData, setInputData, rootData } = props
    const [ inputValue, setInputValue ] = useState(Number(value.quantity ? value.quantity : 0));

    useEffect(()=>{
        console.log(`inputValue: ${inputValue}; type: ${typeof inputValue}`)
    },[inputValue])

    useEffect(()=>{
        if(inputValue <= 0 ) {
            const updatedData = inputData[valueType].filter((item:any)=> item.id !== value.id)
            rootData ? setInputData({ ...rootData, data : { ...inputData, [valueType] : updatedData } }) : setInputData({ ...inputData, [valueType]: updatedData })
            return setInputValue(0)
        }
        const found = inputData[valueType].some((item:any)=> item.id === value.id ) 
        if(rootData){
            if(found) {
                const updatedData = inputData[valueType].map((item:any)=> item.id === value.id ? { ...item, quantity: inputValue } : item )
                setInputData({ ...rootData, data : { ...inputData, [valueType] : updatedData } })
            } else {
                setInputData({ ...rootData, data : { ...inputData, [valueType] : [ ...valueType, value ] } })
            }
        } else {
            if(found) {
                const updatedData = inputData[valueType].map((item:any)=> item.id === value.id ? { ...item, quantity: inputValue } : item )
                setInputData({ ...inputData, [valueType]: updatedData })
            } else {
                setInputData({ ...inputData, [valueType]: [ ...inputData[valueType], { ...value, quantity: inputValue } ] })
            }
        }
    },[inputValue])

    return(
        <div className="h-min w-min flex justify-center items-center">
            <Button onClick={()=>setInputValue((prevValue:number)=> prevValue - 1)} className="bg-primary border-primary text-white p-0 h-6 w-6">-</Button>
            <div className="flex flex-col items-center w-12">
                <input readOnly className="font-black h-5 w-5 text-sm text-center bg-transparent whitespace-pre-line" type="text" value={inputValue} />
                <p className="text-[10px]">{unit}</p>
            </div>
            <Button onClick={()=>setInputValue((prevValue:number)=> prevValue + 1)} className="bg-primary border-primary text-white p-0 h-6 w-6">+</Button>
        </div>
    )
}