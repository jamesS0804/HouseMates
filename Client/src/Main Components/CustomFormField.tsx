import { FormField } from "@/components/ui/form"
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface CustomFormFieldProps {
    userType: string,
    form: any,
    name: string,
    label: string,
    type: string,
    placeholder: string
}

export default function CustomFormField(props: CustomFormFieldProps) {
    const { userType, form, name, label, type, placeholder } = props

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="font-black">{label}</FormLabel>
                    <FormControl>
                        <Input type={type} className={`rounded-2xl shadow-shadow ${userType === "Homeowner" ? 'border-primary' : 'border-secondary'}`} placeholder={placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}