import Header from "@/Main Components/Header";
import CustomFormField from "@/Main Components/CustomFormField";
import * as z from "zod"
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormMessage, FormLabel, FormItem } from "@/components/ui/form"
import homeowner from "../assets/images/homeowner.png"
import housemates from "../assets/images/housemates.png"
import { AxiosInstance } from "axios";
import { Loader2 } from "lucide-react";

interface LoginPageProps {
    userType: string,
    navigate: Function,
    api: AxiosInstance,
    setCurrentUser: Function,
    setAuthKey: Function,
    setUserSessionData: Function
    actionIsLoading: boolean
    setActionIsLoading: Function
    setAlert: Function
}

const formSchema = z.object({
    email: z.string(),
    password: z.string(),
    rememberMe: z.boolean()
})

export default function LoginPage(props:LoginPageProps){
    const { userType, navigate, api, setCurrentUser, setAuthKey, setUserSessionData, actionIsLoading, setActionIsLoading, setAlert } = props
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        setActionIsLoading(true)
        try {
            const res = await api.post("login", {
                user: {
                    email: values.email,
                    password: values.password
                }
            })
            console.log(res)
            if( res.status === 200) {
                const jsonResponse = res.data.data
                setCurrentUser({
                    id: jsonResponse.id, 
                    email: jsonResponse.email,
                    isVerified: jsonResponse.is_verified,
                    userType: jsonResponse.type
                })
                sessionStorage.setItem('userSessionData', JSON.stringify({
                    id: jsonResponse.id, 
                    email: jsonResponse.email,
                    isVerified: jsonResponse.is_verified,
                    userType: jsonResponse.type
                }))
                sessionStorage.setItem('expiry', res.headers['expiry'])
                setAuthKey(res.headers['authorization'])
                sessionStorage.setItem('authToken', res.headers['authorization'].split(' ')[1])
                setUserSessionData({
                    id: jsonResponse.id, 
                    email: jsonResponse.email,
                    isVerified: jsonResponse.is_verified,
                    userType: jsonResponse.type
                })
                setAlert({ status: "SUCCESS", message: res?.data?.data?.message || "Login Successful!" })
                jsonResponse.is_verified ? navigate("/home") : navigate("/verification")
            } else {
                setAlert({ status: "WARNING", message: res?.data?.data?.message || "Something's not quite right." })
            }
        } catch (error:any) {
            console.log(error)
            setAlert({ status: "ERROR", message: error?.response?.data?.status.message || "Something went wrong." })
        }
        setActionIsLoading(false)
    }

    return(
        <div className="h-screen flex flex-col">
            <Header />
            <div className="mt-8 flex flex-col w-full px-7 items-center grow">
                <h3 className={`font-bold text-xl ${userType === 'Homeowner' ? 'text-primary' : 'text-secondary'}`}>Sign Up as a {userType}</h3>
                <img className="h-[10rem]" src={userType === 'Homeowner' ? homeowner : housemates} />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                        <CustomFormField userType={userType} form={form} name={"email"} label={"Email"} type={"email"} placeholder={"johnsmith@gmail.com"} />
                        <CustomFormField userType={userType} form={form} name={"password"} label={"Password"} type={"password"} placeholder={"********"} />
                        <FormField 
                             control={form.control}
                             name="rememberMe"
                             render={() => (
                                 <FormItem>
                                    <div className="flex gap-2 items-center">
                                        <input type="checkbox" className={`${userType === "Homeowner" ? 'border-primary' : 'border-secondary'} rounded-xl`} {...form.register('rememberMe')} />
                                        <FormLabel className="font-black">Remember me</FormLabel>
                                    </div> 
                                    <FormMessage />
                                 </FormItem>
                             )}
                        />
                    </form>
                </Form>
            </div>
            <Button
                className={`page-action-button text-white border-none rounded-none ${userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary'}`}
                onClick={form.handleSubmit(onSubmit)}
            >
                { actionIsLoading ? <>Logging In<Loader2 className={'animate-spin'} /></> : "Login" }
            </Button>
        </div>
    )
}