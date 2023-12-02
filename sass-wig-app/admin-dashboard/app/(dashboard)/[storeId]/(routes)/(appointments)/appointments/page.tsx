import { getAppointments } from "@/actions/appointment-actions"
import AppointmentClient from "@/app/__components/appointments/client"
import Wrapper from "@/app/__components/customs/wrapper"

const AppointmentsPage = async({ params, searchParams }: { searchParams: any, params: { storeId: string }}) => {
  const data = await getAppointments(params.storeId, searchParams)
  
  return (
     <Wrapper>
        <AppointmentClient storeId={params.storeId} data={data} />
     </Wrapper>
  )
}

export default AppointmentsPage