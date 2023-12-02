import React from "react";
import { Trash } from "lucide-react";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import BackComponent from "./back-component";


const FormHeader: React.FC<{
  initialData: any, title: string, description: string, loading: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ initialData, loading, setOpen, title, description }) => {

  return (
    <> 
      <BackComponent loading={loading} showText />
      <div  className="flex items-center justify-between">
        <Heading title={title} description={description} />

        {initialData ? (
          <Button disabled={loading}  variant="destructive"  size="sm" onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </>
  );
};

export default FormHeader;
