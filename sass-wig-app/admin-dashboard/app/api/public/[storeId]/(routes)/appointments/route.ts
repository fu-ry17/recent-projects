import { bookOnlineAppointment } from "@/actions/api-actions";
import { appointmentSchema } from "@/lib/schema";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"


export async function POST( req: NextRequest ) {
  try {
    // api key -> destructure to get store and the details
    const data: z.infer<typeof appointmentSchema> = await req.json()
    
    // console.log({ data, keys: Object.keys(data), isoDate: new Date("2023-10-20 14:39:42.847").toISOString() })
    // replace with the actual storeId
    const res = await bookOnlineAppointment("24f92a2a-b622-4962-ace5-c991e7caf474", data)

    if(res.error){
      return NextResponse.json({ error: res.error}, { status: 400 })
    }else if(res.msg){
      return NextResponse.json({ msg: res.msg }, { status: 200 })
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    } else if (error instanceof Error) {
        console.error(`APPOINTMENT_CREATE_ERROR: ${error.message}`);
      return NextResponse.json({ error: "Something went wrong, try again"}, { status: 400} )
    }
    return NextResponse.json({ error: 'Internal Error'} , { status: 500 });
  }
}