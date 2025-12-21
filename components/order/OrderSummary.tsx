"use client"

import { useStore } from "@/src/store"
import ProductDetails from "./ProductDetails";
import { useMemo } from "react";
import { formatCurrency } from "@/src/utils/currency";
import { createOrder } from "@/actions/create-order-action";
import { OrderSchema } from "@/src/schema";
import { toast } from "react-toastify";
import { ClientOrderCard } from "./ClientOrderCard";
import { useBusiness } from "@/src/context/BusinessContextType";
import { useOrderSubscriptions } from "@/src/hooks/useOrderSuscription";

export default function OrderSummary() {
  const businessId = useBusiness().id;
  const order = useStore((state) => state.order);
  const removeActiveOrder = useStore((state) => state.removeActiveOrder);
  const clearOrder = useStore((state) => state.clearOrder);
  const total = useMemo(()=> order.reduce((total, item) => total + item.subtotal, 0), [order]);
  const activeOrders = useStore(s => s.activeOrders);
  useOrderSubscriptions(businessId, activeOrders);
  const addActiveOrder = useStore(s => s.addActiveOrder);

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
    console.log('creando la orden', result.data);
    
    const response = await createOrder(result.data);
    if(response?.errors){
      response?.errors.forEach(err => {
        toast.error(err.message);
      })
      return;
    }

    toast.success("Order created successfully");
    addActiveOrder(response.order);
    clearOrder();
    console.log('order length', order.length);
    console.log('activeOrders length', activeOrders.length);
  }
  return (
    <aside className="lg:h-screen lg:overflow-y-scroll lg:w-96 md:w-64 p-5">
        <h1 className="text-2xl md:text-4xl text-center font-black">Mi orden</h1>

        {order.length === 0 ? activeOrders.length === 0 ? <p className="text-center mt-10">No hay pedidios</p> :
        (
          activeOrders && activeOrders.length > 0 ?
          activeOrders.map((order) => 
            <ClientOrderCard key={order.id} removeActiveOrder={removeActiveOrder} order={order}/>) 
          : null
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
