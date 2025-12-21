"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pusherClient } from "@/src/lib/pusher-client";

async function fetchReadyOrders(businessSlug: string) {
  const res = await fetch(`/${businessSlug}/orders/api`);
  return res.json();
}

export function useReadyOrders(businessId: string, businessSlug: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["readyOrders", businessId],
    queryFn: ()=> fetchReadyOrders(businessSlug),
  });

  useEffect(() => {
    const channel = pusherClient.subscribe(`${businessId}-orders-channel`);

    let timer: any;

    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        queryClient.invalidateQueries({queryKey: ['readyOrders', businessId]});
      }, 150);
    };

    channel.bind("ready-order", handler);

    return () => {
      channel.unbind("ready-order", handler);
      pusherClient.unsubscribe(`${businessId}-orders-channel`);
    };
  }, [queryClient]);

  return query;
}
