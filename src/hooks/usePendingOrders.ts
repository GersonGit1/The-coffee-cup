"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pusherClient } from "@/src/lib/pusher-client";

async function fetchPendingOrders(businessSlug: string) {
  const res = await fetch(`/${businessSlug}/admin/orders/api`);
  return res.json();
}

export function usePendingOrders(businessId: string, businessSlug: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["pendingOrders", businessId],
    queryFn: () => fetchPendingOrders(businessSlug),
  });

  useEffect(() => {
    const channel = pusherClient.subscribe(`${businessId}-orders-channel`);

    let timer: any;

    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        queryClient.invalidateQueries({queryKey: ["pendingOrders", businessId]});
      }, 150);
    };

    channel.bind("new-order", handler); //escuchar cuando se crea una nueva orden e invalidar la query para tener los datos actualizados
    channel.bind("ready-order", handler);//escuchar cuando una orden se marca como lista e invalidar la query para tener los datos actualizados
    channel.bind("preparing-order", handler);
    channel.bind("canceled-order", handler);

    return () => {
      channel.unbind("new-order", handler);
      channel.unbind("ready-order", handler);
      channel.unbind("preparing-order", handler);
      channel.unbind("canceled-order", handler);
      pusherClient.unsubscribe(`${businessId}-orders-channel`);
    };
  }, [queryClient]);

  return query;
}
