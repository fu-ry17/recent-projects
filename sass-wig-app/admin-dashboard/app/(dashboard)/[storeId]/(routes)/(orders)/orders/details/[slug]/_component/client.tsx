"use client"
import { IFormattedOrder } from "@/types/types"
import { useRef, useState } from "react"
import DetailCard from "./detail-card"
import OrderButtons from "./order-buttons"
import PrintComponent from "@/app/__components/customs/print-component"
import BackComponent from "@/app/__components/customs/back-component"

const OrderDetailClient = ({
  order, storeId
}: { order: IFormattedOrder, storeId: string }) => {

  const [loading, setLoading] = useState<boolean>(false)
  const componentRef = useRef<any | null>(null)

  return (
    <div className="max-w-4xl mx-auto">

      <div className="flex justify-between w-full">
         <BackComponent showText />
         <PrintComponent id={order.id} loading={loading} showText componentRef={componentRef} />
      </div>

      <DetailCard order={order} loading={loading} setLoading={setLoading} storeId={storeId} componentRef={componentRef} />

      <OrderButtons order={order} loading={loading} storeId={storeId} />
    
    </div>
  )
}

export default OrderDetailClient