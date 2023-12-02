"use client"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface InputProps {
    name: string, label?: string, placeholder: string, form: any
    disabled: boolean, description?: string, type?: any, textarea?: boolean
}

const InputField = ({ name, form, label, placeholder, disabled, description, type, textarea  }: InputProps ) => {
  return (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
        <FormItem id={name}>
            { label ? <FormLabel htmlFor={name}>{label}</FormLabel> : null }
            <FormControl>
              {
                 textarea ? 
                 <Textarea placeholder={placeholder} {...field} disabled={disabled} /> :
                 <Input type={type} placeholder={placeholder} {...field} disabled={disabled} />
              }
            </FormControl>
            { description ? <FormDescription>{description}</FormDescription> : null}
            <FormMessage />
        </FormItem>
        )}
     />
  )
}

export default InputField