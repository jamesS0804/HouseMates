import Header from "@/Main Components/Header";
import CustomFormField from "@/Main Components/CustomFormField";
import * as z from "zod"
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import homeowner from "../assets/images/homeowner.png"
import housemates from "../assets/images/housemates.png"
import { Form, FormField, FormMessage, FormLabel, FormItem, FormControl } from "@/components/ui/form"
import { getBarangays, getCities, getProvinces } from "@/utils/geographic_data";
import { useEffect, useState } from "react";
import getCityZipcode from "@/utils/getCityZipcode";
import { Input } from "@/components/ui/input";
import CustomSelectField from "@/Main Components/CustomSelectField";
import progressPart1 from "../assets/images/progress1.png"
import progressPart2 from "../assets/images/progress2.png"
import ServiceSelection from "@/Main Components/ServiceSelection";
import authenticated_api from "@/utils/authenticated_api";
import { Loader2 } from "lucide-react";

interface VerificationPageProps {
    userType: string,
    navigate: Function,
    currentUser: {
        id: number,
        name: string,
        email: string,
        phoneNumber: string,
        addressAttributes: {
            addressLine1: string,
            barangay: string,
            city: string,
            province: string,
            zipCode: string
        }
    },
    setCurrentUser: Function,
    setUserSessionData: Function,
    userSessionData: any
    actionIsLoading: boolean
    setActionIsLoading: Function
    setAlert: Function
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
    const { userType, navigate, currentUser, setCurrentUser, setUserSessionData, userSessionData, actionIsLoading, setActionIsLoading, setAlert } = props
    const provinces = getProvinces()
    const [ selectedProvince, setSelectedProvince ] = useState("")
    const [ selectedCity, setSelectedCity ] = useState("") 
    const [ barangays, setBarangays ] = useState<Array<string>>([])
    const [ cities, setCities ] = useState<Array<string>>([])
    const [ zipcode, setZipcode ] = useState("")
    const [ verificationPart, setVerificationPart ] = useState(1)
    const [ preferredServices, setPreferredServices ] = useState<Array<object>>([]) 

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: currentUser.email,
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
        setSelectedCity((prevSelectedCity:string)=>{
            prevSelectedCity = selectedCity
            prevSelectedCity = cityInput
            return prevSelectedCity
        })
        setZipcode(()=>getCityZipcode(cityInput))
        setBarangays(()=>getBarangays(cityInput))
    }

    const handleProvinceChange = (provinceInput: string) => {
        form.setValue('province', provinceInput);
        setSelectedProvince((prevSelectedProvince:string)=>{
            prevSelectedProvince = selectedProvince
            prevSelectedProvince = provinceInput
            return prevSelectedProvince
        })
        setCities(()=>getCities(provinceInput))
    };

    const updateIsVerified = async (userID:number, userUrl:string) => {
        setActionIsLoading(true)
        try {
            const res = await authenticated_api.patch(`api/v1/${userUrl}/${userID}`, {
                [userType.toLowerCase()]: {
                    is_verified: true
                } 
            })
            if ( res.status === 200 ) {
                setAlert({ status: "SUCCESS", message: res?.data?.data?.message || "Verification Successful!" })
                setUserSessionData({ ...userSessionData, isVerified: true })
                setCurrentUser({...currentUser, isVerified: true})
            } else {
                setAlert({ status: "WARNING", message: res?.data?.data?.message || "Something's not quite right." })
            }
        } catch (error:any) {
            setAlert({ status: "ERROR", message: error?.response?.data?.status.message || "Something went wrong." })
        }
        setActionIsLoading(false)
    }

    const basicInfoSubmit = async (values: z.infer<typeof formSchema>) => {
        setActionIsLoading(true)
        try {
            const res = await authenticated_api.post("api/v1/profiles", {
                profile: {
                    id: currentUser.id,
                    name: values.name,
                    email: currentUser.email,
                    phone_number: values.phoneNumber,
                    address_attributes: {
                        address_line_1: values.address,
                        barangay: values.barangay,
                        city: values.city,
                        province: values.province,
                        zip_code: values.zipcode
                    }
                }
            })
            console.log(res)
            if( res.status === 201 ) {
                const jsonResponse = res.data.data
                setCurrentUser({ ...currentUser,
                    name: jsonResponse.name,
                    phoneNumber: jsonResponse.phone_number,
                    addressAttributes: {
                        addressLine1: jsonResponse.address_line_1,
                        barangay: jsonResponse.barangay,
                        city: jsonResponse.city,
                        province: jsonResponse.province,
                        zipCode: jsonResponse.zip_code
                    }
                })
                if(userType === 'Homeowner'){
                    setAlert({ status: "SUCCESS", message: res?.data?.data?.message || "Profile successfully updated!" })
                    updateIsVerified(currentUser.id, 'homeowners')
                    navigate("/home")
                }
                setVerificationPart(2)
            } else {
                setAlert({ status: "WARNING", message: res?.data?.data?.message || "Something's not quite right." })
            }
        } catch (error:any) {
            console.log(error)
            setAlert({ status: "ERROR", message: error?.response?.data?.status.message || "Something went wrong." })
        }
        setActionIsLoading(false)
    }

    const basicInfoAndServicesSubmit = async () => {
        setActionIsLoading(true)
        try {
            const res = await authenticated_api.post("api/v1/housemate_services", 
                {
                    housemate_service: {
                        id: currentUser.id,
                        email: currentUser.email,
                        services: preferredServices
                    }
                }
            )
            if ( res.status === 201 ) {
                setAlert({ status: "SUCCESS", message: res?.data?.data?.message || "Profile and preferred services successfully updated!" })
                updateIsVerified(currentUser.id, 'housemates')
                navigate("/home")
            } else {
                setAlert({ status: "WARNING", message: res?.data?.data?.message || "Something's not quite right." })
            }
        } catch (error:any) {
            setAlert({ status: "ERROR", message: error?.response?.data?.status.message || "Something went wrong." })
        }
        setActionIsLoading(false)
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
                    {
                        userType === "Homeowner" ? <></>
                            :
                            <div className="w-100 flex justify-center">
                                {
                                    verificationPart === 1 ? <img src={progressPart1}/> : <img src={progressPart2}/>
                                }
                            </div>
                    }
                    <div>
                        {
                            verificationPart === 1 ?
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(basicInfoSubmit)} className="space-y-4 w-full">
                                        <CustomFormField userType={userType} form={form} name={"name"} label={"Name"} type={"name"} placeholder={"John Smith"} /    >
                                        <CustomFormField userType={userType} form={form} name={"email"} label={"Email"} type={"email"} placeholder={"johnsmith@gmail.com"} readOnly={true} />
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
                                    <ServiceSelection userType={userType} selectionType="multiple" outputData={preferredServices} setOutputData={setPreferredServices}/>
                                </div>
                        }
                    </div>
                    
                </div>
                <Button
                    className={`text-white rounded-2xl border-none ${userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary'}`}
                    onClick={ verificationPart === 1 ? form.handleSubmit(basicInfoSubmit) : form.handleSubmit(basicInfoAndServicesSubmit)}
                >
                    {
                        actionIsLoading ? 
                            <>
                                {
                                    verificationPart === 1 ?
                                        <>Processing<Loader2 className="animate-spin"/></> 
                                        : 
                                        <>Submitting<Loader2 className="animate-spin"/></>
                                }
                            </>
                            :
                            verificationPart === 1 ? 
                                "Next" 
                                : 
                                "Submit" 
                    }
                </Button>
            </div>
        </div>
    )
}