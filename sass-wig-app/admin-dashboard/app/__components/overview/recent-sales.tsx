"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentColumns } from "../appointments/columns";
import Link from "next/link";
import { useParams } from "next/navigation";

export function RecentSales({ appointments }: { appointments: AppointmentColumns[] }) {
  const params = useParams()

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-xl">Upcoming activities</CardTitle>
        <CardDescription>
          {appointments.length > 0
            ? `You have ${appointments.length} appointments today`
            : 'You have no appointments today'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {appointments.length > 0 ? (
            appointments.map((a) => (
              <div className="flex items-center" key={a.id}>
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{a.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <Link href={`/${params.storeId}/orders/details/${a.orderId}`} className="text-sm font-medium leading-none">{a.name}</Link>
                  <p className="text-sm text-muted-foreground">{a.services}</p>
                </div>
                <div className="ml-auto font-medium">{a.time}</div>
              </div>
            ))
          ) : (
            <div className="text-center">You have no appointments today</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
