"use client"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SelectProps {
    name: string, label?: string, placeholder: string, form: any
    disabled: boolean, description?: string, data: any[]
}

const SelectField = ({ name, form, label, placeholder, disabled, description, data }: SelectProps ) => {
  return (
    <FormField
        control={form.control} name={name}
        render={({ field }) => (
            <FormItem>
                { label ? <FormLabel>{label}</FormLabel> : null }
                <Select disabled={disabled}  onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder={placeholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data.map((item, i) => (
                        <SelectItem key={i} value={item.id ? item.id : item.name}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                </Select>
                { description ? <FormDescription>{description}</FormDescription> : null}
                <FormMessage />
            </FormItem>
        )}
     />
  )
}

export default SelectField