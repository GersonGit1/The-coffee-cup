"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pusherClient } from "@/src/lib/pusher-client";

async function fetchReadyOrders() {
  const res = await fetch("/orders/api");
  return res.json();
}

export function useReadyOrders() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["readyOrders"],
    queryFn: fetchReadyOrders,
  });

  useEffect(() => {
    const channel = pusherClient.subscribe("orders-channel");

    let timer: any;

    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        queryClient.invalidateQueries({queryKey: ['readyOrders']});
      }, 150);
    };

    channel.bind("ready-order", handler);

    return () => {
      channel.unbind("ready-order", handler);
      pusherClient.unsubscribe("orders-channel");
    };
  }, [queryClient]);

  return query;
}
