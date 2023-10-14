import CustomFormField from "@/Main Components/CustomFormField";
import CustomSelectField from "@/Main Components/CustomSelectField";
import NavigationBar from "@/Main Components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import authenticated_api from "@/utils/authenticated_api";
import { getBarangays, getCities, getProvinces } from "@/utils/geographic_data";
import getCityZipcode from "@/utils/getCityZipcode";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod"

interface ProfilePageProps {
    navigate: Function
    userType: string
    currentUser: any
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

export default function ProfilePage(props: ProfilePageProps) {
    const { userType, currentUser } = props
    const provinces = getProvinces()
    const [ selectedProvince, setSelectedProvince ] = useState("")
    const [ selectedCity, setSelectedCity ] = useState("") 
    const [ barangays, setBarangays ] = useState<Array<string>>([])
    const [ cities, setCities ] = useState<Array<string>>([])
    const [ zipcode, setZipcode ] = useState("")
    const [ inUpdateState, setInUpdateState ] = useState(false) 
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: currentUser.name,
            email: currentUser.email,
            phoneNumber: currentUser.phoneNumber,
            address: currentUser.addressAttributes.addressLine1,
            barangay: currentUser.addressAttributes.barangay,
            city: currentUser.addressAttributes.city,
            province: currentUser.addressAttributes.province,
            zipcode: currentUser.addressAttributes.zipCode,
        }
    })

    useEffect(()=>{
        form.setValue('zipcode',zipcode)
    },[zipcode])

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

    const updateProfile = async (values: z.infer<typeof formSchema>) => {
        console.log("here")
        console.log(values)
        try {
            const res = await authenticated_api.patch(`api/v1/profiles/${currentUser.id}`,
                {
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
                }
            )
            if(res.status === 200) {
                console.log(res)
                setInUpdateState(false)
            } else {
                console.log(res)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleLogout = async () => {
        try {
            await authenticated_api.delete("logout")
            sessionStorage.clear()
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div className="h-screen flex flex-col items-center">
            <div className={`flex flex-col items-center w-full ${userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary'}`}>
                <h1 className="my-4 font-verdana text-[#EBCE9F] font-black header-2">My Profile</h1>
            </div>
            <div className="w-screen flex flex-col items-center justify-center px-4 py-3 gap-2">
                <div className="flex gap-3 justify-start items-center w-full">
                    <UserCircle2 className="h-16 w-16" />
                    <h3 className="font-black text-xl">{currentUser.name}</h3>
                    <Button onClick={handleLogout} className="bg-red-500 border-none text-white ml-auto font-black">Logout</Button>
                </div>
                <div className="w-full flex flex-col gap-2">
                    {
                        <div className={`relative flex flex-col gap-2 border ${userType === 'Homeowner' ? 'border-primary' : 'border-secondary'} rounded-2xl p-3`}>
                            <h3 className={`${userType === 'Homeowner' ? 'border-primary' : 'border-secondary'} font-black`}>Credit Wallet <span>Balance</span></h3>
                            <div className="flex gap-1">
                                <h3 className="font-bold">PHP</h3>
                                <p className="font-black text-3xl">
                                    {Number(currentUser.balance).toLocaleString('en-PH')}</p>
                            </div>
                            <Button className={`${userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary'} border-none mt-4 text-white font-black text-xs w-20 h-6`}>Send</Button>
                        </div>
                    }
                    <div className={`${userType === 'Homeowner' ? 'border-primary' : 'border-secondary'} border`} />
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(updateProfile)} className="space-y-4 w-full overflow-auto h-[350px] pb-3">
                            {
                                inUpdateState ?
                                    <>
                                        <CustomFormField userType={userType} form={form} name={"name"} label={"Name"} type={"name"} placeholder={"John Smith"} />
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
                                    </>
                                    :
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col gap-2">
                                            <div className="font-black">Name</div>
                                            <div className="ml-3">{currentUser.name}</div>
                                        </div>
                                        <div className={`${userType === 'Homeowner' ? 'border-primary' : 'border-secondary'} border`} />
                                        <div className="flex flex-col gap-2">
                                            <div className="font-black">Email</div>
                                            <div className="ml-3">{currentUser.email}</div>
                                        </div>
                                        <div className={`${userType === 'Homeowner' ? 'border-primary' : 'border-secondary'} border`} />
                                        <div className="flex flex-col gap-2">
                                            <div className="font-black">Phone Number</div>
                                            <div className="ml-3">{currentUser.phoneNumber}</div>
                                        </div>
                                        <div className={`${userType === 'Homeowner' ? 'border-primary' : 'border-secondary'} border`} />
                                        <div className="flex flex-col gap-2">
                                            <div className="font-black">Address</div>
                                            <div className="ml-3">{`${currentUser.addressAttributes.addressLine1} ${currentUser.addressAttributes.barangay}, ${currentUser.addressAttributes.city}, ${currentUser.addressAttributes.province} (${currentUser.addressAttributes.zipCode})`}</div>
                                        </div>
                                        <div className={`${userType === 'Homeowner' ? 'border-primary' : 'border-secondary'} border`} />
                                    </div>  
                            }
                        </form>
                        <Button onClick={ inUpdateState ? form.handleSubmit(updateProfile) : ()=> { setInUpdateState(true) } } className={`${userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary'} border-none mt-2 text-white font-black text-xs py-4 px-0 w-full h-6`}>{ inUpdateState ? 'Update Profile' : 'Edit Profile' }</Button>
                    </Form>
                </div>
            </div>
            <NavigationBar userType={userType} selectedOption="profile" />
        </div>
    )
}