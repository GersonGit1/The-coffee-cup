"use client";

import { useEffect, useRef } from "react";
import { pusherClient } from "@/src/lib/pusher-client";
import { useStore } from "@/src/store";

export function useOrderSubscriptions(
  businessId: string,
  activeOrders: { id: string }[]
) {
  const updateOrderStatus = useStore(s => s.updateOrderStatus);

  // evita doble suscripción
  const subscribed = useRef<Set<string>>(new Set());

  useEffect(() => {
    activeOrders.forEach(order => {
      if (subscribed.current.has(order.id)) return;

      const channelName = `${businessId}-order-${order.id}`;
      const channel = pusherClient.subscribe(channelName);

      const handler = (payload: { id: string; status: string }) => {
        updateOrderStatus(payload.id, payload.status);

        if (["ready", "preparing"].includes(payload.status)) {
          pusherClient.unsubscribe(channelName);
        }
      };

      channel.bind("order-status-changed", handler);
      subscribed.current.add(order.id);
    });

    return () => {
      subscribed.current.forEach(orderId => {
        pusherClient.unsubscribe(`${businessId}-order-${orderId}`);
      });
      subscribed.current.clear();
    };
  }, [activeOrders, businessId]);
}
