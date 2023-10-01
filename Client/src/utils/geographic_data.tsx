import data from "../utils/geographic_data.json"

export function getProvinces(): Array<string> {
    const province_list:Array<string> = []
    Object.values(data).forEach((region:any) => {
        Object.keys(region.province_list).forEach((province:string)=>{
            province_list.push(province)
        })
    })
    const sorted_province_list = province_list.sort()
    return sorted_province_list
}

export function getCities(selectedProvince: string): Array<string> {
    const city_list:Array<string> = []
    Object.values(data).forEach((region:any) => {
        Object.entries(region.province_list).forEach((province:any)=>{
            if(province[0] === selectedProvince.toUpperCase()){
                city_list.push(province[1].municipality_list)
            }
        })
    })
    const sorted_city_list = Object.keys(city_list[0]).sort()
    return sorted_city_list
}

export function getBarangays(selectedCity: string): Array<string> {
    const barangay_list:Array<string> = []
    Object.values(data).forEach((region:any) => {
        Object.values(region.province_list).forEach((province:any)=>{
            Object.entries(province.municipality_list).forEach((municipal:any)=>{
                if(municipal[0] === selectedCity.toUpperCase()){
                    barangay_list.push(municipal[1].barangay_list)
                }
            })
        })
    })
    const sorted_barangay_list = Object.values(barangay_list[0]).sort()
    return sorted_barangay_list
}