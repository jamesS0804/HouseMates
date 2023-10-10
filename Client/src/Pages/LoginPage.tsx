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

interface LoginPageProps {
    userType: string,
    navigate: Function,
    api: AxiosInstance,
    setCurrentUser: Function,
    setAuthKey: Function,
    setIsVerified: Function
}

const formSchema = z.object({
    email: z.string(),
    password: z.string(),
    rememberMe: z.boolean()
})

export default function LoginPage(props:LoginPageProps){
    const { userType, navigate, api, setCurrentUser, setAuthKey, setIsVerified } = props
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            const res = await api.post("login", {
                user: {
                    email: values.email,
                    password: values.password
                }
            })
            if( res.status === 200) {
                console.log(res)
                const jsonResponse = res.data.data.user
                setCurrentUser({
                    id: jsonResponse.id, 
                    email: jsonResponse.email,
                    isVerified: jsonResponse.is_verified,
                    userType: jsonResponse.type
                })
                sessionStorage.setItem('email', jsonResponse.email)
                setAuthKey(res.headers['authorization'])
                sessionStorage.setItem('authToken', res.headers['authorization'].split(' ')[1])
                setIsVerified(jsonResponse.isVerified)
                jsonResponse.isVerified ? navigate("/home") : navigate("/verification")
            } else {
                console.log(res)
            }
        } catch (error) {
            console.log(error)
        }
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
            >Login</Button>
        </div>
    )
}