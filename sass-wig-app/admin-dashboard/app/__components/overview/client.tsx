"use client"

import { TodayExpenseType, TodayOrderType, } from '@/types/expenseTypes'
import { AppointmentColumns } from '../appointments/columns'
import { DataTable } from '../datatable/data-table'
import ReviewCard from './review-card'
import DefaultHeader from '@/components/ui/default-header'
import { mobileOrderColumns, orderColumns } from '../order/column'
import { expenseColumns, mobileExpenseColumns } from '../expenses/columns'
import { IOrderResponse, IOverview } from '@/types/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { weeklyCommissionColumns } from '../commissions/column'


const OverViewClient = ({
   storeId, overview, todayExpenses, todayOrders, appointments, month, commissionWeekly
}: { appointments: AppointmentColumns[], overview: IOverview[], todayOrders: TodayOrderType, todayExpenses: TodayExpenseType, storeId: string, 
  commissionWeekly: any, month: IOrderResponse[] }) => {

  return (
    <div className='w-full'>
        <Tabs defaultValue="overview" className="space-y-3 border-none">
            <TabsList className="grid max-w-xs grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
            </TabsList>

            <TabsContent value="overview">
                <ReviewCard month={month} overview={overview} appointments={appointments}/>
            </TabsContent>

            <TabsContent value="activities" className='border-none outline-none'>

                <div className='my-8'>
                    <DefaultHeader data={todayOrders.formattedOrders} storeId={storeId as string} title='Today Orders' url='orders/new' sm />
        
                     {/* display on desktop */}
                    <div className='w-full hidden md:block'>
                        <DataTable columns={orderColumns} data={todayOrders.formattedOrders} searchKey='name' total={todayOrders.totalAmount} />
                    </div>
                    
                    {/* display on mobile */}
                    <div className='w-full block md:hidden'>
                        <DataTable columns={mobileOrderColumns} data={todayOrders.formattedOrders} searchKey='name' total={todayOrders.totalAmount} />
                    </div>
                </div>

                
                <div>
                   <DefaultHeader data={todayExpenses.formattedExpenses} storeId={storeId as string} title='Today Expenses' url='expenses/new' sm />
                     {/* display on desktop */}
                    <div className='w-full hidden md:block'>
                        <DataTable searchKey='title' columns={expenseColumns} data={todayExpenses.formattedExpenses} total={todayExpenses.totalAmount} />
                    </div>
                    
                    {/* display on mobile */}
                    <div className='w-full block md:hidden'>
                        <DataTable searchKey='title' 
                           columns={mobileExpenseColumns}
                           data={todayExpenses.formattedExpenses} 
                           total={todayExpenses.totalAmount} 
                         />
                   </div>
                </div>

                <div className='my-4'>
                    <DefaultHeader data={commissionWeekly.data} storeId={storeId as string} title='Weekly Commissions' url='commissions/new' sm />
                     {/* display on desktop */}
                    <div className='w-full'>
                        <DataTable searchKey='name' 
                         columns={weeklyCommissionColumns} 
                         data={commissionWeekly.data} 
                         total={commissionWeekly.total} 
                      />
                    </div>
                    
                </div>
              

            </TabsContent>

            {/* <TabsContent value="notifications">
                <h1> Notifications </h1>
            </TabsContent> - to be updated in the future */}

        </Tabs>
    </div>
  )
}

export default OverViewClient