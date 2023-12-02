import { formatter } from "@/lib/utils";

export const startandEndDayUTC = (today: Date) => {
    // Start and day end utc
    const startOfDay = new Date(today)
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setUTCHours(23, 59, 59, 999);

    return { startOfDay, endOfDay }
}

export const getMonthDataTotals = async (currentMonth: string, lastMonth: string, data: any[], name: string) => { 
    // reusable for expenses and orders
    const totals = { currentMonth: 0, lastMonth: 0 }; 
  
    data.forEach((item) => {
        if (item.month === currentMonth) {
          // @ts-ignore
          totals.currentMonth +=  parseFloat(String(item[name]))
        } else if (item.month === lastMonth) {
          // @ts-ignore
          totals.lastMonth +=  parseFloat(String(item[name]))
        }
    })
  
    const percentageChange = (  // already fixed
        totals.currentMonth === 0 && totals.lastMonth === 0 ?  0 : 
        totals.lastMonth === 0 && totals.currentMonth > 0 ? 100 : 
        ((totals.currentMonth - totals.lastMonth) / totals.lastMonth) * 100
    )
    
    //formated percentage
    const formattedPercentageChange = `${percentageChange.toFixed(1)}%`;
    const result = `${totals.currentMonth > totals.lastMonth ? "+" : "" }${formattedPercentageChange} from last month`;
    // status up, down, neutral
    const status = result.slice(0,1)
  
    const displayStatus = status === '-' && name === "amount" ? "up" : status === '+' && name === "amount" ? "down" : "neutral" // expenses
    const displayStatus2 = status === '+' && name === "amountPaid" ? "up" : status === '-' && name === "amountPaid" ? "down" : "neutral" //orders
  
    return { 
      revenue: formatter.format(totals.currentMonth).toLowerCase(),
      percentage: result,
      status: name === "amount" ? displayStatus : displayStatus2
    }
}

// Function to calculate profit percentage change and status
export const calculateProfitStatus = (currentMonthProfit: number, previousMonthProfit: number) => {
  const percentageChange = ((currentMonthProfit - previousMonthProfit) / Math.abs(previousMonthProfit)) * 100;
  const sign = percentageChange > 0 ? "+" : percentageChange < 0 ? "-" : "";
  const formattedPercentageChange = `${sign}${Math.abs(percentageChange).toFixed(1)}%`;
  const status = percentageChange > 0 ? "up" : percentageChange < 0 ? "down" : "neutral";

  const revenue =
    currentMonthProfit.toString().startsWith('-')
      ? // temporary solution
        `kes ${currentMonthProfit.toLocaleString()}.00`
      : formatter.format(currentMonthProfit).toLowerCase();

  return {
    revenue,
    percentage: `${formattedPercentageChange} from last month`,
    status,
  };
};
