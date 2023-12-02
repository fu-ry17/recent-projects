"use client"
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import Select from 'react-select';


interface InputProps {
    name: string, label?: string, placeholder: string, form: any
    disabled: boolean, description?: string, data: any[], noMulti?: boolean
}

const MultiSelectField = ({ form, name, label, disabled, description, data, placeholder, noMulti }: InputProps ) => {
  
  return (
    <FormField
        control={form.control}
        name={name} // configure if required
        render={({ field }) => (
        <FormItem>
            { label ? <FormLabel htmlFor={name}>{label}</FormLabel> : null }
            <FormControl>
               <Select aria-label='select' className='bg-inherit text-black' name={name} placeholder={placeholder}
               isMulti={noMulti ? false : true} options={data} 
               onChange={field.onChange} value={field.value} isDisabled={disabled}  />
            </FormControl>
            { description ? <FormDescription>{description}</FormDescription> : null}
            <FormMessage />
        </FormItem>
        )}
     />
  )
}

export default MultiSelectField