import prismadb from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest){
//    try {
//     // api key
//     const storeId = "24f92a2a-b622-4962-ace5-c991e7caf474"

//     // add searchParam to filter whether its for appointment use or not

//     const store = await prismadb.store.findFirst({ where: { id: storeId } })
//     if(!store){
//         return NextResponse.json({ error: "Unauthorized access"}, { status: 401 }) 
//     }

//     const data = await prismadb.orderCategory.findMany({ where: { storeId }, orderBy: { createdAt: 'desc' }})

//     const formattedCategories = data.map(item => ({ 
//         value: item.id,
//         label: item.name,
//         // appointmentUse: item.appointmentUse
//     }))

//     return NextResponse.json(formattedCategories, { status: 200 , statusText: 'cool'})

//    } catch (error) {
//        if (error instanceof Error) {
//           console.error(`ORDER_CATEGORIES_ERROR: ${error.message}`);
//           return NextResponse.json({ error: "Something went wrong, try again"}, { status: 400 })
//        }
//        return NextResponse.json({ error: 'Internal Error'} , { status: 500 });
//    }
// }

export async function GET(req: NextRequest) {
    try {
        // get all 2023 orders and contacts
        // get all 2022 orders and contacts
    } catch (error) {
        if (error instanceof Error) {
            console.error(`ORDER_CATEGORIES_ERROR: ${error.message}`);
            return NextResponse.json({ error: "Something went wrong, try again"}, { status: 400 })
        }

        return NextResponse.json({ error: 'Internal Error'} , { status: 500 });
    }
}