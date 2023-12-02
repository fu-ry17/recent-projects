"use client"
import { IOverview } from "@/types/types";
import {
  Bar,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function OverviewGraph({ overview }: { overview: IOverview[] }) {
  const data = overview.map((d) => ({
    month: d.month.slice(0, 3).toLocaleUpperCase(),
    amount: d.totalAmount,
    orders: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={data}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip filterNull={true} />
        <Legend />

        {/* Bar chart for Total Amount */}
        <Bar dataKey="amount" name="Total Amount" fill="#adfa1d" radius={[4, 4, 0, 0]} />

        {/* Line chart for Total Number of Orders */}
        <Line
          type="monotone"
          dataKey="orders"
          name="Total Orders"
          stroke="#8884d8"
          fill="#000000"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
