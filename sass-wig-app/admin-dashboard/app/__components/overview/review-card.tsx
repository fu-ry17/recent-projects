
import { IOrderResponse, IOverview } from '@/types/types'
import { AppointmentColumns } from '../appointments/columns'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { OverviewGraph } from './overview-graph'
import { RecentSales } from './recent-sales'
import RevenueCard from './revenue-card'

const ReviewCard = ({
  overview, appointments, month
}: { overview: IOverview[], appointments: AppointmentColumns[], month: IOrderResponse[] }) => {
  return (
     <>  
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 w-full">
          {
            month.map(d => (
               <RevenueCard data={d} key={d.name}/>
            ))
          }   
      </div>

      <div className="grid gap-y-8 gap-x-4 md:grid-cols-2 lg:grid-cols-7 my-4">
        <RecentSales appointments={appointments} />

        <Card className="col-span-4 order-second">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewGraph overview={overview} />
          </CardContent>
        </Card>
        
      </div>
     
     </>
  )
}

export default ReviewCard