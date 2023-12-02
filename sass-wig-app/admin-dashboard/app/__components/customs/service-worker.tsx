"use client"
import serviceWorkerStore from "@/hooks/service-worker";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ServiceWorker() {
  const { updateWorker } = serviceWorkerStore();

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" })
        .then((registration) => {
           updateWorker(registration);
        })
        .catch((err) => {
          toast.error("Service Worker registration failed");
        });
    }
  }, [updateWorker]);

  return <></>;
}
