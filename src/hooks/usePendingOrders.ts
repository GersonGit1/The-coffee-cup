"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { pusherClient } from "@/src/lib/pusher-client";

async function fetchPendingOrders() {
  const res = await fetch("/admin/orders/api");
  return res.json();
}

export function usePendingOrders() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["pendingOrders"],
    queryFn: fetchPendingOrders,
  });

  useEffect(() => {
    const channel = pusherClient.subscribe("orders-channel");

    let timer: any;

    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        queryClient.invalidateQueries({queryKey: ['pendingOrders']});
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
      pusherClient.unsubscribe("orders-channel");
    };
  }, [queryClient]);

  return query;
}
