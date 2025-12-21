"use client"

import LatestOrderItem from '@/components/order/LatestOrderItem';
import Logo from '@/components/ui/Logo'
import Spinner from '@/components/ui/Spinner';
import { useBusiness } from '@/src/context/BusinessContextType';
import { useReadyOrders } from '@/src/hooks/useReadyOrders';
import { OrderWhitProductSchema } from '@/src/schema';

export default function page() {
  const business = useBusiness();
  const {data, error, isLoading} = useReadyOrders(business.id, business.slug);
  const result = OrderWhitProductSchema.safeParse(data);
  
  if(isLoading) return <Spinner/>
  if (error) return <p>Error al cargar</p>;

  if (result.success)
    return (
        <>
            <h1 className="text-center mt-20 font-black text-6xl">Ordenes listas</h1>
            
            <Logo/>

            {data.length ? (
                <div className="grid grid-cols-2 mt-10 gap-5 max-w-5xl mx-auto">
                    {result.data.map(order => (
                        <LatestOrderItem key={order.id} order={order}/>
                    ))}
                </div>
            ): <p className="text-center my-10">No hay Ordenes listas</p>}
        </>
    )
}
