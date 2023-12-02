import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useCustomRouter from "@/hooks/custom-router"

export function Sort({ title, data, qtype }: { title: string, qtype?: string, data: any[] }) {
  const { pushQuery, query } = useCustomRouter()

  const currentValue = qtype === "status" ? query.status : qtype === "month" ? query.month : query.sort || ""

  return (
    <Select defaultValue={currentValue} onValueChange={value => {
      let pushValue = qtype === "status" ? {...query, status: value } :
      qtype === "month" ? { ...query, month: value } : { ...query, sort: value }
      pushQuery(pushValue)
    }}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectItem key="default" value={`""`}>{title}</SelectItem> */}
          {/* fix this later */}
          {
            data.map((item, i) => (
              <SelectItem key={i} value={item.id ? item.id : item.name ? item.name : item}>
                {item.name ? item.name : item}
              </SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
