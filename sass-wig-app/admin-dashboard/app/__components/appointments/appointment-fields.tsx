"use client"
import { type } from "@/lib/dataArr";
import React from "react";
import DatePickerField from "../customs/date-picker-field";
import InputField from "../customs/input-field";
import MultiSelectField from "../customs/multi-select-field";
import SelectField from "../customs/select-field";

interface IAppointmentFieldProps{
  loading: boolean, form: any,  formattedOrderCategory: any[]
}

const AppointmentFormFields: React.FC<IAppointmentFieldProps> = ({ loading, form,formattedOrderCategory }) => {

  return (
    <div className="grid md:grid-cols-3 md:gap-8 gap-4">
      <InputField name="name" placeholder="Client name" disabled={loading} form={form} label="Client name" />
      <InputField name="unit" placeholder="Unit" disabled={loading} form={form} label="Unit" />

      <MultiSelectField name="services" data={formattedOrderCategory} 
        disabled={loading} form={form} label="Service" placeholder="Choose service(s)" />

      <SelectField name="type" placeholder="Type" disabled={loading} form={form} label="Type" data={type}
      description="choose if unit belongs to the store of not (store | non-store)" /> 
      {/* server action error */}

      <InputField name="phone" placeholder="+254" disabled={loading} form={form} label="Phone number"
        description="use the +254 phone number format" />

      <DatePickerField name="date" label="Pick Date" placeholder="Pick Appointment Date" disabled={loading} form={form}
       description="Choose a date Monday - Saturday " />

       <InputField name="time" placeholder="Time" type="time" disabled={loading} form={form} label="Pick Time" 
       description="Time should be between 9.30am - 6pm " />

      <InputField name="note" placeholder="More info...." disabled={loading} form={form} label="Note" textarea
       description="Any addittional information goes here" />
    </div>
  );
};

export default AppointmentFormFields;
