import { getAppointment } from '@/actions/appointment-actions'
import AppointmentForm from '@/app/__components/appointments/appointment-form'
import Wrapper from '@/app/__components/customs/wrapper'
import prismadb from '@/lib/prisma'
import { formatCategory } from '@/lib/utils'
import React from 'react'

const AppointmentCreateUpdate = async({ params }: { params: { storeId: string, appointmentId: string }}) => {
  const appointment = await getAppointment(params.appointmentId, params.storeId)
  const orderCategories = await prismadb.orderCategory.findMany({ where: { storeId: params.storeId, appointmentUse: true }})

  return (
    <Wrapper>
        <AppointmentForm 
           initialData={appointment}  
           formattedOrderCategory={formatCategory(orderCategories) || []}
           storeId={params.storeId} 
        />
    </Wrapper>
  )
}

export default AppointmentCreateUpdate