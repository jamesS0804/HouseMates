import Header from "@/Main Components/Header";
import CustomFormField from "@/Main Components/CustomFormField";
import * as z from "zod"
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import homeowner from "../assets/images/homeowner.png"
import housemates from "../assets/images/housemates.png"
import NavigationBar from "@/Main Components/NavigationBar";
import { Form, FormField, FormMessage, FormLabel, FormItem, FormControl } from "@/components/ui/form"
import { getBarangays, getCities, getProvinces } from "@/utils/geographic_data";
import { useEffect, useState } from "react";
import getCityZipcode from "@/utils/getCityZipcode";
import { Input } from "@/components/ui/input";
import CustomSelectField from "@/Main Components/CustomSelectField";
import progressPart1 from "../assets/images/progress1.png"
import progressPart2 from "../assets/images/progress2.png"
import ServiceSelection from "@/Main Components/ServiceSelection";

interface VerificationPageProps {
    userType: string
}

const formSchema = z.object({
    name: z.string(),
    email: z.string().email({
        message: "Please provide a proper email."
    }),
    phoneNumber: z.string().nonempty("Please provide a valid phone number."),
    address: z.string().nonempty("Address must not be blank."),
    barangay: z.string().nonempty("Barangay must not be blank."),
    city: z.string().nonempty("City must not be blank."),
    province: z.string().nonempty("Province must not be blank."),
    zipcode: z.string(),
})

export default function VerificationPage(props:VerificationPageProps) {
    const { userType } = props
    const provinces = getProvinces()
    const [ selectedProvince, setSelectedProvince ] = useState("")
    const [ selectedCity, setSelectedCity ] = useState("") 
    const [ barangays, setBarangays ] = useState<Array<string>>([])
    const [ cities, setCities ] = useState<Array<string>>([])
    const [ zipcode, setZipcode ] = useState("")
    const [ verificationPart, setVerificationPart ] = useState(1)
    const [ preferredServices, setPreferredServices ] = useState<Array<string>>([]) 

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            address: "",
            barangay: "",
            city: "",
            province: "",
            zipcode: "",
        }
    })

    useEffect(()=>{
        form.setValue('zipcode',zipcode)
    },[zipcode])

    useEffect(()=>{
        setVerificationPart(verificationPart)
    },[verificationPart])

    const handleCityChange = (cityInput: string) => {
        form.setValue('city', cityInput)
        setSelectedCity(cityInput)
        setZipcode(()=>getCityZipcode(cityInput))
        setBarangays(()=>getBarangays(cityInput))
    }

    const handleProvinceChange = (provinceInput: string) => {
        form.setValue('province', provinceInput);
        setSelectedProvince(provinceInput)
        setCities(()=>getCities(provinceInput))
    };

    const basicInfoSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("submitting..")
        console.log(values)
        try {
            if(values) {
                console.log("verifying in..")
                setVerificationPart(2)
            } else {
                console.log("invalid values")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const basicInfoAndServicesSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("submitting..")
        console.log(values)
        console.log(preferredServices)
    }

    return(
        <div className="h-screen flex flex-col items-center">
            <Header />
            <div className="grow flex flex-col items-center p-4 pb-20">
                <h3 className={`font-bold text-xl ${userType === 'Homeowner' ? 'text-primary' : 'text-secondary'}`}>Welcome {userType}!</h3>
                <img className="h-[7rem]" src={userType === 'Homeowner' ? homeowner : housemates} />
                <p className={`tracking-widest font-bold ${userType === 'Homeowner' ? 'text-primary' : 'text-secondary'}`}>Let's get you verified!</p>
                <p className="font-bold text-xs">Tell us more about yourself</p>
                <div className="p-4 px-0">
                    <div className="w-100 flex justify-center">
                        {
                            verificationPart === 1 ? <img src={progressPart1}/> : <img src={progressPart2}/>
                        }
                    </div>
                    <div>
                        {
                            verificationPart === 1 ?
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(basicInfoSubmit)} className="space-y-4 w-full">
                                        <CustomFormField userType={userType} form={form} name={"name"} label={"Name"} type={"name"} placeholder={"John Smith"} />
                                        <CustomFormField userType={userType} form={form} name={"email"} label={"Email"} type={"email"} placeholder={"johnsmith@gmail.com"} />
                                        <CustomFormField userType={userType} form={form} name={"phoneNumber"} label={"Phone Number"} type={"phoneNumber"} placeholder={"09123456789"} />
                                        <CustomFormField userType={userType} form={form} name={"address"} label={"Address"} type={"address"} placeholder={"Address line"} />
                                        <div className="flex gap-4 grow">
                                            <CustomSelectField userType={userType} form={form} name={"barangay"} label={"Barangay"} data={barangays}/>
                                            <CustomSelectField userType={userType} form={form} name={"city"} label={"City"} onChange={handleCityChange} data={cities}/>
                                        </div>
                                        <div className="flex gap-4 grow">
                                            <CustomSelectField userType={userType} form={form} name={"province"} label={"Province"} onChange={handleProvinceChange} data={provinces}/>
                                            <FormField
                                                control={form.control}
                                                name="zipcode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="font-black">Zip Code</FormLabel>
                                                        <FormControl>
                                                            <Input disabled type="text" {...field} value={zipcode} className={`text-center font-bold rounded-2xl shadow-shadow ${userType === "Homeowner" ? 'border-primary' : 'border-secondary'}`} placeholder={""}/>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            
                                        </div>
                                    </form>
                                </Form>
                                :
                                <div className="mt-4 flex flex-col gap-2">
                                    <h3>Please select your preferred service below:</h3>
                                    <ServiceSelection userType={userType} selectionType="multiple" outputData={preferredServices} setOutputData={setPreferredServices} />
                                </div>
                        }
                    </div>
                    
                </div>
                <Button
                    className={`text-white rounded-2xl border-none ${userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary'}`}
                    onClick={ verificationPart === 1 ? form.handleSubmit(basicInfoSubmit) : form.handleSubmit(basicInfoAndServicesSubmit)}
                >{ verificationPart === 1 ? "Next" : "Submit" }</Button>
            </div>
            <NavigationBar userType={userType} />
        </div>
    )
}