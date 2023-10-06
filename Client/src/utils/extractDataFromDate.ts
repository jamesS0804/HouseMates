export default function extractDataFromDate(date:string, type:string){
    const stringArray = String(date).split(" ")
    switch(type){
        case "day":
            return stringArray[0]
        case "month":
            return stringArray[1]
        case "date":
            return stringArray[2]
        case "year":
            return stringArray[3]
        default:
            return date
    }
}