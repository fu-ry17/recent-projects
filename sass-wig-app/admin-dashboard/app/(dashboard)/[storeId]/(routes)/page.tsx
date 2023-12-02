import { weeklyCommission } from '@/actions/commission-actions';
import { getTodayAppointments, getTodayExpenses, getTodayOrders, monthlyAnalysis, overView } from '@/actions/dashboard-action';
import Wrapper from '@/app/__components/customs/wrapper';
import OverViewClient from '@/app/__components/overview/client';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { TodayExpenseType, TodayOrderType } from '@/types/expenseTypes';

const HomePage = async({ params}: { searchParams: any, params: { storeId: string }}) => {
  const todayOrders: TodayOrderType = await getTodayOrders(params.storeId)
  const todayExpenses: TodayExpenseType = await getTodayExpenses(params.storeId)
  const appointments = await getTodayAppointments(params.storeId)
  const month = await monthlyAnalysis(params.storeId)
  const overview = await overView(params.storeId)
  // check search params
  const commissionWeekly = await weeklyCommission(params.storeId, params)

  return (
    <Wrapper>
      <Heading title='Dashboard' description='welcome to your dashboard' />
      <Separator />

      <OverViewClient 
          appointments={appointments || []} 
          month={month || []}
          storeId={params.storeId}
          overview={overview || []} 
          todayOrders={todayOrders} todayExpenses={todayExpenses}
          commissionWeekly={commissionWeekly}
      />

    </Wrapper>
  )
}

export default HomePage