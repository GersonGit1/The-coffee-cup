"use client"

import { useStore } from "@/src/store"
import ProductDetails from "./ProductDetails";
import { useEffect, useMemo } from "react";
import { formatCurrency } from "@/src/utils/currency";
import { createOrder } from "@/actions/create-order-action";
import { OrderSchema } from "@/src/schema";
import { toast } from "react-toastify";
import { pusherClient } from "@/src/lib/pusher-client";
import { currentOrderType } from "@/src/types";
import { ClientOrderCard } from "./ClientOrderCard";

export default function OrderSummary() {
  const order = useStore((state) => state.order);
  const currentOrder = useStore((state) => state.currentOrder);
  const clearOrder = useStore((state) => state.clearOrder);
  const setCurrentOrder = useStore((state) => state.setCurrentOrder);
  const clearCurrentOrderIfFinished = useStore((state) => state.clearCurrentOrderIfFinished);
  const updateCurrentOrderStatus = useStore((state) => state.updateCurrentOrderStatus);
  const total = useMemo(()=> order.reduce((total, item) => total + item.subtotal, 0), [order]);

  useEffect(() => {
    if (!currentOrder?.id) return;

    const channelName = `order-${currentOrder.id}`;
    const channel = pusherClient.subscribe(channelName);

    const handler = (order : currentOrderType) => {
      clearCurrentOrderIfFinished(order.status);
      updateCurrentOrderStatus(order.status);
    };

    channel.bind("order-status-changed", handler);

    return () => {
      channel.unbind("order-status-changed", handler);
      pusherClient.unsubscribe(channelName);
    };
  }, [currentOrder]);

  const handleCreateOrder = async (formData: FormData)=>{
    const data = {
      name: formData.get("name"),
      total: total,
      order: order
    };
    
    const result = OrderSchema.safeParse(data);
    
    if(!result.success){
      result.error.issues.forEach(err => {
        toast.error(err.message);
      })
      return;
    }

    const response = await createOrder(result.data);
    if(response?.errors){
      response?.errors.forEach(err => {
        toast.error(err.message);
      })
      return;
    }

    setCurrentOrder(response.order)
    toast.success("Order created successfully");
    clearOrder();
  }
  return (
    <aside className="lg:h-screen lg:overflow-y-scroll lg:w-96 md:w-64 p-5">
        <h1 className="text-4xl text-center font-black">My Order</h1>
        {order.length === 0 ? currentOrder == null ? <p className="text-center mt-10">No hay pedidios</p> :
        (
          <ClientOrderCard order={currentOrder}/>
        ) : (
          <div className="mt-5">
            {order.map(item => (
              <ProductDetails key={item.id} item={item} />
            ))}
            <p className="text-2xl mt-20 text-center">
              Total a pagar: {' '}
              <span className="font-black">
                {formatCurrency(total)}
              </span>
            </p>
            <form action={handleCreateOrder} className="mt-10 w-full space-y-5">

              <input type="text" 
              className="bg-white border border-gray-100 p-2 w-full"
              name="name" placeholder="Your Name" />

              <input type="submit" 
              className="py-2 rounded uppercase text-white bg-black w-full text-center font-bold cursor-pointer"
              value="Confirmar pedido" />
            </form>
          </div>
        )}
    </aside>
  )
}
