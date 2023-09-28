import Header from "@/Main Components/Header";
import CustomFormField from "@/Main Components/CustomFormField";
import * as z from "zod"
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormMessage, FormLabel, FormItem } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox";
import homeowner from "../assets/images/homeowner.png"
import housemates from "../assets/images/housemates.png"

const formSchema = z.object({
    name: z.string().min(3, {
        message: "Name must be at least 3 characters."
    }),
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

interface SignupPageProps {
    userType: string;
}

export default function SignupPage(props: SignupPageProps) {
    const { userType } = props

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            privacyCheckbox: false
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("submitting..")
        console.log(values)
    }

    return (
        <div className="h-screen flex flex-col items-center">
            <Header />
            <div className="mt-8 flex flex-col w-full px-7 items-center grow">
                <h3 className={`font-bold text-xl ${userType === 'Homeowner' ? 'text-primary' : 'text-secondary'}`}>Sign Up as a {userType}</h3>
                <img className="h-[12rem]" src={userType === 'Homeowner' ? homeowner : housemates} />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
                        <CustomFormField userType={userType} form={form} name={"name"} label={"Name"} type={"text"} placeholder={"John Smith"} />
                        <CustomFormField userType={userType} form={form} name={"email"} label={"Email"} type={"email"} placeholder={"johnsmith@gmail.com"} />
                        <CustomFormField userType={userType} form={form} name={"password"} label={"Password"} type={"password"} placeholder={"********"} />
                        <CustomFormField userType={userType} form={form} name={"confirmPassword"} label={"Re-confirm Password"} type={"password"} placeholder={"********"} />
                        <FormField 
                             control={form.control}
                             name="privacyCheckbox"
                             render={() => (
                                 <FormItem>
                                    <div className="flex gap-2 items-center">
                                        <Checkbox className={`${userType === "Homeowner" ? 'border-primary' : 'border-secondary'} rounded-xl`} {...form.register('privacyCheckbox')} />
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
                <a className={`${userType === "Homeowner" ? 'text-primary' : 'text-secondary'} font-black underline`}>Login</a>
            </div>
            <Button
                className={`page-action-button text-white border-none rounded-none ${userType === 'Homeowner' ? 'bg-primary' : 'bg-secondary'}`}
                onClick={form.handleSubmit(onSubmit)}
            >Sign Up</Button>
        </div>
    )
}