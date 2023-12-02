import { formatter } from '@/lib/utils'
import { CalcExpenseCategoryType } from '@/types/expenseTypes'

const CalExpenseCard = ({ data, total }: { data: CalcExpenseCategoryType[], total: number }) => {
  return (
    <>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-6'>
        {data.map(d => (
          <div key={d.id}
          className='flex items-center gap-x-3 px-2 py-3 rounded-lg capitalize 
          hover:shadow-xl shadow-sm cursor-pointer flex-wrap border'>
            <div className='text-white gap-x-3 p-4 rounded-md capitalize hover:shadow-lg cursor-pointer bg-yellow-500'>
              {d.category?.slice(0, 1)}
            </div>
            <div>
                <h1 className="text-sm font-bold">{d.category as string} ({d.totalCount})</h1>
                <p className='text-xs font-bold text-gray-500'>{formatter.format(d.totalAmount).toLocaleLowerCase()}</p>
            </div>
          </div>
        ))}
      </div>
      
      <h1 className='text-lg'> Total: {formatter.format(total).toLowerCase() }</h1>
    </>
  )
}

export default CalExpenseCard