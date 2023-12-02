import { AppointmentColumns } from "@/app/__components/appointments/columns";
import { ExpenseColumns } from "@/app/__components/expenses/columns";
import { getMonth, monthNames } from "@/lib/dataArr";
import prismadb from "@/lib/prisma";
import { formatter } from "@/lib/utils";
import { TodayExpenseType } from "@/types/expenseTypes";
import { calculateProfitStatus, getMonthDataTotals, startandEndDayUTC } from "@/utils/dashboard-actions";
import { format } from "date-fns";

export const getTodayOrders = async (storeId: string, date?: Date) => {
    const month = getMonth()
    const year = new Date().getFullYear()
    // current date is not provided, use the current date
    const today = date || new Date();
    const { startOfDay, endOfDay } = startandEndDayUTC(today)
  
    try {  
      const todayOrders = await prismadb.order.findMany({
        where: { 
           storeId, month, year,
           createdAt: { gte: startOfDay, lte: endOfDay}
        },
        include: { orderCategories: true },
        orderBy: { createdAt: "desc"}
      });
  
      const formattedOrders = todayOrders.map(o => ({
        id: o.id,
        name: o.name,
        unit: o.unit as string,
        amountPaid: formatter.format(o.amountPaid.toNumber()).toLowerCase(), 
        category: o.orderCategories.map(o => o.name).join(", "),
        status: o.status, 
        balance: formatter.format(o.balance.toNumber()).toLowerCase(),
        createdAt: format(o.createdAt, "M/d/y"),
     }))

      // get the total for that day(only)
      const totalAmount = todayOrders.reduce((acc, init) => parseFloat(String((init.amountPaid))) + acc ,0)
      return { totalAmount: formatter.format(totalAmount).toLowerCase(), formattedOrders }

    } catch (error: any) {
      console.error('Error:', error.message);
      return { totalAmount: formatter.format(0).toLowerCase(), formattedOrders: [] }
    }
}

export const getTodayExpenses = async (storeId: string, date?: Date): Promise<TodayExpenseType> => {
    try {
      // current date is not provided, use the current date
      const today = date || new Date();
      const { startOfDay, endOfDay } = startandEndDayUTC(today);
  
      // month and year
      const month = getMonth()
      const year = new Date().getFullYear();
  
      const data = await prismadb.expense.findMany({
        where: {
          storeId, month,year,
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
        include: { expenseCategory: true },
        orderBy: { createdAt: "desc" },
      });
  
      const formattedExpenses: ExpenseColumns[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.expenseCategory.name,
        amount: formatter.format(item.amount.toNumber()).toLowerCase(),
        createdAt: format(item.createdAt, "M/d/y"),
      }));
  
      // get the total for that day
      const totalAmount = data.reduce((acc, init) => parseFloat(String(init.amount)) + acc, 0);
  
      return { totalAmount: formatter.format(totalAmount).toLowerCase(), formattedExpenses }

    } catch (error: any) {
      // Handle errors more accurately. You can log the error for debugging purposes.
      console.error('Error in getTodayExpenses:', error.message);
      return { totalAmount: formatter.format(0).toLowerCase(), formattedExpenses: [] }
    }
}

export const getTodayAppointments = async(storeId: string, date?: Date) => {
  try {
    const today = date || new Date();
    const { startOfDay, endOfDay } = startandEndDayUTC(today);
      // month and year
      const month = getMonth()
      const year = new Date().getFullYear();
  
    const data = await prismadb.appointment.findMany({
      where: {
        storeId, order: { month,year },
        date: { gte: startOfDay, lte: endOfDay },
      },
      orderBy: { date: "desc" },
      include: { order: { include: { orderCategories: true }}}
    });
  
    const formattedAppointments: AppointmentColumns[] = data.map((item) => ({
      id: item.id,
      unit: item.order?.unit as string,
      date: format(item.date, "PPP"),
      status: item.order?.status as string,
      name: item.order?.name as string,
      orderId: item.order?.id as string,
      services: item.order?.orderCategories.map(o => o.name).join(', ') as string,
      time: item.time
    }))
  
    return formattedAppointments

  } catch (error) {
     if(error instanceof Error){
       console.log("Appointents error", error.message)
       return []
     }
  }
}

export const overView = async (storeId: string) => {
  try {
    const year = new Date().getFullYear();

    const groupedOrders = await prismadb.order.groupBy({
        by: "month",
        where: { year: year, storeId: storeId },
        _count: { id: true },
        _sum: { amountPaid: true },
    })

    // initialize monthly data with zeros
    const monthlyData = monthNames.map(month => ({
        month: month, count: 0, totalAmount: 0
    }))

    // update with data from the database
    groupedOrders.forEach(order => {
        const monthIndex = monthNames.indexOf(order.month);
        if (monthIndex !== -1) {
          monthlyData[monthIndex].count = order._count.id;
          monthlyData[monthIndex].totalAmount = parseFloat(String(order._sum.amountPaid));
        }
    })

    return monthlyData

  } catch (error) {
    if(error instanceof Error){
      console.error("Error in overView:", error.message);
    }
  }
}

export const monthlyAnalysis = async (storeId: string) => {
  const currentMonth = getMonth();
  const monthIndex = new Date().getMonth();
  const year = new Date().getFullYear();
  const lastMonth = getMonth(monthIndex - 1);

  try {
    // Combine orders, expenses, orderCounts, and profit queries
    const [orders, expenses, calcExpense, orderCounts, profit] = await Promise.all([
      prismadb.order.findMany({
        where: { month: { in: [currentMonth, lastMonth] }, storeId, year },
      }),
      prismadb.expense.findMany({
        where: { month: { in: [currentMonth, lastMonth] }, storeId, year },
      }),
      prismadb.expense.groupBy({
        by: ["month"],
        where: { month: { in: [currentMonth, lastMonth] }, storeId, year },
        _sum: { amount: true }
      }),
      prismadb.order.groupBy({
        by: ["month"],
        where: { month: { in: [currentMonth, lastMonth] }, storeId, year },
        _count: { id: true },
      }),
      prismadb.order.groupBy({
        by: ["month"],
        where: { month: { in: [currentMonth, lastMonth] }, storeId, year },
        _count: { id: true },
        _sum: { amountPaid: true }
      }),
    ]);

    // Calculate totals concurrently
    const [orderResponse, expenseResponse] = await Promise.all([
      getMonthDataTotals(currentMonth, lastMonth, orders, "amountPaid"),
      getMonthDataTotals(currentMonth, lastMonth, expenses, "amount"),
    ]);

    // Map over orderCounts and create a new object for display
    const orderCountsMap = {};
    orderCounts.forEach((count) => {
      // @ts-ignore
      orderCountsMap[count.month] = count._count.id;
    });

    // Map over profit data and create a new object for display
    const profitMap = {};
    profit.forEach((monthProfit) => {
      // @ts-ignore
      profitMap[monthProfit.month] = monthProfit._sum.amountPaid;
    });

    // Map over expenses data and create a new object for display
    const calcExpenseMap = {};
    calcExpense.forEach((expense) => {
      // @ts-ignore
      calcExpenseMap[expense.month] = expense._sum.amount;
    });

    // Calculate current and previous month profit
    // @ts-ignore
    const expense2 = calcExpenseMap[currentMonth]
    // @ts-ignore
    const currentMonthProfit = profitMap[currentMonth] - (calcExpenseMap[currentMonth] || 0);
    // @ts-ignore
    const previousMonthProfit = profitMap[lastMonth] - (calcExpenseMap[lastMonth] || 0);

    // Calculate percentage change and determine status
    const profitStatus = calculateProfitStatus(currentMonthProfit, previousMonthProfit);

    return [
      {...orderResponse, name: 'Total revenue'},
      {...expenseResponse, name:'Expenses'},
      // orderCounts: orderCountsMap,
       {...profitStatus, name: 'Profit'},
     ]

  } catch (error) {
    console.error("Error in monthlyAnalysis:", error);
  }
}
