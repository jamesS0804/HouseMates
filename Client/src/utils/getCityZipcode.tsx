import zipcodes from "../utils/zipcodes.json";

export default function getCityZipcode(selectedCity: string) {
    const entry = Object.entries(zipcodes).find((entry: any)=> entry[1] === selectedCity)
    const zipcode = entry ? entry[0] : "0000"
    return zipcode
}