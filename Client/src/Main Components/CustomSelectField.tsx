import { FormField, FormMessage, FormLabel, FormItem, FormControl } from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CustomSelectFieldProps {
    userType: string,
    form: any,
    name: string,
    label: string,
    onChange?: any,
    data: Array<string>
}

export default function CustomSelectField(props:CustomSelectFieldProps){
    const { userType, form, name, label, onChange, data } = props
    
    return(
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="font-bold">{label}</FormLabel>
                    <Select onValueChange={onChange || field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className={`w-[8.5rem] shadow-shadow ${userType === 'Homeowner' ? 'border-primary' : 'border-secondary'}`}>
                                <SelectValue placeholder={label} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="h-40 w-[70%]">
                            {
                                data.map((name:string)=>{
                                    return(
                                        <SelectItem key={name} value={name}>{name}</SelectItem>
                                    )
                                })
                            }
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}