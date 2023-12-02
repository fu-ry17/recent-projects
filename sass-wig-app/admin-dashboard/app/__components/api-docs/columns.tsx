import { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";
import CellAction from "../datatable/cell-action";
import { deleteApiKey } from "@/actions/api-key-actions";


export type ApiKeysColumn = { // refactor
    id: string;
    key: any;
    active: boolean;
    copied: boolean;
    createdAt: string;
}

export const apiKeyColumns: ColumnDef<ApiKeysColumn>[] = [
    {
      accessorKey: "key",
      header: "Api Key",
      cell: ({ row }) => 
      <div className="cursor-pointer" onClick={() => {
        if(row.original.copied === false){ // allow it to be copied if it's not already in use
            navigator.clipboard.writeText(row.original.key)
            toast.success("Api key copied to clipboard")
        }else {
            toast.success("Api key is already in use")  
        }
      }}>
        <h1 className="md:block hidden">  {(row.original.key).slice(0,45).concat("******")} </h1>
        <h1 className="md:hidden block">  {(row.original.key).slice(0,15).concat("****")} </h1>
       </div> 
    },
    {
      accessorKey: "copied",
      header: "Copied",
    },
    {
      accessorKey: "createdAt",
      header: "Date",
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} copy update customId={row.original.key} url="" delFunction={deleteApiKey} />
    }
]
  
