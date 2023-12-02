"use client"
import React from "react";
import { Loader2 } from "lucide-react";
import Dropzone from "../customs/dropzone";
import ImagePreview from "../customs/image-preview";
import { Button } from "@/components/ui/button";


interface ExpenseFormActionsProps {
  loading: boolean;
  action: string;
  images: File[] | any[];
  setImages: React.Dispatch<React.SetStateAction<File[] | any[]>>;
}

const ExpenseFormActions: React.FC<ExpenseFormActionsProps> = ({
   loading, action, images, setImages 
}) => {

  return (
    <>
       <div className="md:grid md:grid-cols-3 gap-8">
          <Dropzone title="Upload Receipt(s)" setImages={setImages} disabled={loading} />
        </div>

        <ImagePreview images={images} setImages={setImages} loading={loading} />

        <Button disabled={loading} className="ml-auto" type="submit">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : action}
        </Button>
    </>
  );
};

export default ExpenseFormActions;
