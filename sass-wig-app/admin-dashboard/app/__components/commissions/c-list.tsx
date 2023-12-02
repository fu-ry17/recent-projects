"use client"
import { monthNames, sortArr } from "@/lib/dataArr";
import { DataTable } from "../datatable/data-table";
import { Sort } from "../features/sort";
import { CommissionColumn, commissionColumns, mobileCommissionColumns } from "./column";
import { formatter } from "@/lib/utils";

type GroupedCommissions = Record<string, any>

const CommissionList = ({ data, month }: { data: GroupedCommissions, month: string }) => {
  const year = new Date().getFullYear()

  console.log({ data })

  return (
    <div>

      <div className="flex justify-between items-center pt-2 pb-4 gap-3 md:gap-0 flex-wrap">
        <h1 className="capitalize text-lg"> {`${month}-${year}`}</h1>

        <div className="flex gap-4 flex-wrap">
           <Sort title="Month" qtype="month" data={monthNames} />
           <Sort title="A-Z" data={sortArr} />
        </div>

      </div>

       { 
       Object.keys(data).length > 0 ? 
        Object.keys(data).map((weekKey) => (
            <div key={weekKey}>
                <h1>{weekKey}</h1>
                
                {/* display on desktop */}
                <div className='w-full hidden md:block'>
                    <DataTable columns={commissionColumns} data={data[weekKey]?.commissions}  
                    total={formatter.format(data[weekKey]?.totalCommission).toLowerCase()} 
                    searchKey='name' />
                </div>
                
                {/* display on mobile */}
                <div className='w-full block md:hidden'>
                <DataTable columns={mobileCommissionColumns} data={data[weekKey]?.commissions} 
                 total={formatter.format(data[weekKey]?.totalCommission).toLowerCase()} 
                 searchKey='name' />
                </div>

            </div>
            )):
            <>
                <DataTable  columns={mobileCommissionColumns} data={[]} searchKey='name' />
            </>
        }

    </div>
  )
}

export default CommissionList