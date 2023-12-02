"use client"
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

interface DatePickerProps {
    name: string, label?: string, placeholder: string, form: any
    disabled: boolean, description?: string,
}

const DatePickerField = ({ name, form, label, placeholder, disabled, description }: DatePickerProps ) => {
  return (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem className="flex flex-col">
            { label ? <FormLabel htmlFor={name}>{label}</FormLabel> : null }
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant={"outline"} disabled={disabled}
                    className={cn( "w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground" )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>{placeholder}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date: any) =>
                    date < new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            { description ? <FormDescription> {description}</FormDescription> : null  }
            <FormMessage />
          </FormItem>
        )}
     />
  )
}

export default DatePickerField