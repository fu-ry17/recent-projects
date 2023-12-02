"use client"
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

interface AppointmentFormActionsProps {
  loading: boolean;
  action: string;
}

const AppointmentFormActions: React.FC<AppointmentFormActionsProps> = ({
   loading, action,
}) => {

  return (
    <>
        <Button disabled={loading} className="ml-auto" type="submit">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : action}
        </Button>
    </>
  );
};

export default AppointmentFormActions;