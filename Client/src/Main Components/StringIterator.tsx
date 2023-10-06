import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface StringIteratorProps {
    valueType: string
    values: Array<any>
    inputData: object
    setInputData: Function
}

export default function StringIterator(props: StringIteratorProps){
    const { valueType, values, inputData, setInputData } = props
    const [ index, setIndex ] = useState(0)

    useEffect(()=>{
        setInputData({...inputData, [valueType]: { type: values[index].type, title: values[index].title, price: values[index].price } })
    },[index])

    const changeIndex = (type:string) => {
        if(type === "previous") {
            if(index === 0) return 0
            setIndex((prevIndex)=> prevIndex - 1)
        } else {
            if(index === values.length - 1) return index
            setIndex((prevIndex)=> prevIndex + 1)
        }
    }
    return(
        <div className="h-full w-full flex justify-center items-center">
            <Button onClick={()=> changeIndex("previous")} className="bg-primary border-primary text-white p-0 w-6 rounded-r-none h-[1.65rem]">{'<'}</Button>
            <input readOnly className="font-black h-6 w-full text-sm text-center bg-transparent p-3 border border-primary" type="text" value={values[index].title} />
            <Button onClick={()=> changeIndex("next")} className="bg-primary border-primary text-white p-0 h-[1.60rem] rounded-l-none w-6">{'>'}</Button>
        </div>
    )
}