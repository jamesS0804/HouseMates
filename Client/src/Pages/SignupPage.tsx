import * as z from "zod"
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormMessage, FormLabel, FormItem } from "@/components/ui/form"
import { Link } from "react-router-dom";
import { AxiosInstance } from "axios";
import { Loader2 } from "lucide-react";
import homeowner from "../assets/images/homeowner.png"
import housemates from "../assets/images/housemates.png"
import Header from "@/Main Components/Header";
import CustomFormField from "@/Main Components/CustomFormField";

interface SignupPageProps {
    userType: string
    api: AxiosInstance
    navigate: Function
    setAlert: Function
    actionIsLoading: boolean
    setActionIsLoading: Function
}

const formSchema = z.object({
    email: z.string().email({
        message: "Not a valid email."
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters."
    }),
    confirmPassword: z.string().min(6, {
        message: "Password must be at least 6 characters."
    }),
    privacyCheckbox: z.boolean().refine((privacyCheckbox) => {
        return privacyCheckbox === true;
      }, {
        message: "You must accept our privacy policy."
    })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
}).refine((data) => data.privacyCheckbox === true, {
    message: "You must accept our privacy policy.",
    path: ["privacyCheckbox"]
});

export default function SignupPage(props: SignupPageProps) {
    const { userType, navigate, api, setAlert, actionIsLoading, setActionIsLoading } = props

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            privacyCheckbox: false
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setActionIsLoading(true)
        try {
            const res = await api.post("signup", {
                user: {
                    email: values.email,
                    password: values.password,
                    type: userType
                }
            })
            console.log(res)
            if ( res.status === 200 ) {
                setAlert({ status: "SUCCESS", message: res?.data?.data?.message || "Signup Successful!" })
                navigate("/login")
            } else {
                setAlert({ status: "WARNING", message: res?.data?.data?.message || "Something's not quite right." })
            }
        } catch (error:any) {
            console.log(error)
            setAlert({ status: "ERROR", message: error?.response?.data?.errors?.message || "Something went wrong." })
        }
        setActionIsLoading(false)
    }

    return (
        <div className="h-screen flex flex-col items-center">
            <Header />
            <div className="mt-8 flex flex-col w-full px-7 items-center grow">
                <h3 className={`font-bold text-xl ${userType === 'Homeowner' ? 'text-primary' : 'text-secondary'}`}>Sign Up as a {userType}</h3>
                <img className="h-[10rem]" src={userType === 'Homeowner' ? homeowner : housemates} />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                        <CustomFormField userType={userType} form={form} name={"email"} label={"Email"} type={"email"} placeholder={"johnsmith@gmail.com"} />
                        <CustomFormField userType={userType} form={form} name={"password"} label={"Password"} type={"password"} placeholder={"Password"} />
                        <CustomFormField userType={userType} form={form} name={"confirmPassword"} label={"Re-confirm Password"} type={"password"} placeholder={"Password"} />
                        <FormField 
                             control={form.control}
                             name="privacyCheckbox"
                             render={() => (
                                 <FormItem>
                                    <div className="flex gap-2 items-center">
                                        <input type="checkbox" className={`${userType === "Homeowner" ? 'border-primary' : 'border-secondary'} rounded-xl`} {...form.register('privacyCheckbox')} />
                                        <FormLabel className="font-black">I agree with privacy policy</FormLabel>
                                    </div> 
                                    <FormMessage />
                                 </FormItem>
                             )}
                        />
                    </form>
                </Form>
            </div>
            <div className="flex gap-2 items-center p-4">
                <span className="font-black">Already have an account?</span>
                <Link to="/login">
                    <div className={`${userType === "Homeowner" ? 'text-primary' : 'text-secondary'} font-black underline`}>Login</div>
                </Link>
            </div>
            <Button
                className={`page-action-button text-white border-none rounded-none ${userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary'}`}
                onClick={form.handleSubmit(onSubmit)}
            >
                { actionIsLoading ? <>Signing Up<Loader2 className={'animate-spin'} /></> : "Signup" }
            </Button>
        </div>
    )
}