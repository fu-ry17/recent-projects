import CalcCard from "@/components/ui/cal-card"
import { formatter } from "@/lib/utils"
import { IExpense } from "@/types/expenseTypes"
import { format } from "date-fns"
import ExpenseButtons from "./ex-buttons"
import BackComponent from "@/app/__components/customs/back-component"
import ViewImages from "@/app/__components/customs/view-images"

const ExpenseDetailClient = ({ expense, storeId}: { expense: IExpense, storeId: string }) => {
  return (
    <div className="max-w-lg">
      <BackComponent showText />
      <div className="flex w-full justify-between py-3">
         <div></div>
         <span className="capitalize">{expense.month} - {expense.year}</span>
      </div>
      
      <h1 className='text-2xl font-bold tracking-wide pb-3'>{expense.title}</h1>
      <h2 className='pb-3'>{formatter.format(expense.amount).toLocaleLowerCase()}</h2>
      <p className='pb-3'> Reference No: <span className="uppercase font-black tracking-wide"> {expense.reference} </span> </p>
      <CalcCard data={expense} />
      <p className='py-2'>Created On: {format(expense.createdAt, "PPP")}</p>

      { expense.expenseImages.length > 0 ?
       <> 
          <h3 className='text-xl tracking-wider md:py-2 py-5'>Reciept Image(s)</h3>
          <ViewImages images={expense.expenseImages} /> 
       </>
       : <div className="py-4"></div>}
       

       <ExpenseButtons id={expense.id} storeId={storeId} />

    </div>
  )
}

export default ExpenseDetailClient