import { IExpense } from '@/types/expenseTypes'
import { format } from 'date-fns'

const CalcCard = ({ data }: { data: IExpense }) => {
  return (
    <>
        <div key={data.id}
          className='flex items-center gap-x-3 rounded-lg capitalize cursor-pointer flex-wrap'>
            <div className='text-white gap-x-3 p-4 rounded-md capitalize hover:shadow-lg cursor-pointer bg-yellow-500 px-5'>
              {data.expenseCategory.name.slice(0, 1)}
            </div>
            <div>
                <h1 className="text-sm font-bold pb-1">{data.expenseCategory.name}</h1>
                <p className='text-sm text-semibol tracking-wide'>last updated: {format(data.updatedAt, "PPP")}</p>
            </div>
          </div>
      </>
  )
}

export default CalcCard