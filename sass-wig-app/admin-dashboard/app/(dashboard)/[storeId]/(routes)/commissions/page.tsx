import { CommissionResponse, getCommissions, weeklyCommission } from '@/actions/commission-actions'
import CommissionClient from '@/app/__components/commissions/client'
import Wrapper from '@/app/__components/customs/wrapper'


const CommissionPage = async({ searchParams, params }: { searchParams: any, params: { storeId: string }}) => {
  // @ts-ignore -> fix later
  const { groupedCommission, month, count }: CommissionResponse = await getCommissions(params.storeId, searchParams)
  // const weekly = await weeklyCommission(params.storeId, searchParams)

  // console.log({ weekly })

  return (
    <Wrapper>
       <CommissionClient storeId={params.storeId} data={groupedCommission} count={count} month={month} />
    </Wrapper>
  )
}

export default CommissionPage