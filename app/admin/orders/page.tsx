"use client"
import OrderCard from '@/components/order/OrderCard';
import Heading from '@/components/ui/Heading'
import Spinner from '@/components/ui/Spinner';
import { usePendingOrders } from '@/src/hooks/usePendingOrders';
import { OrderWhitProductSchema } from '@/src/schema';

export default function Orders() {

  const {data, error, isLoading} = usePendingOrders();
  const result = OrderWhitProductSchema.safeParse(data);
  
  if(isLoading) return <Spinner/>
  if (error) return <p>Error al cargar</p>;

  if (result.success)
  return (
    <>
      <Heading>
        Administrar Ordenes
      </Heading>
      {data.length ? (
        <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5 mt-5'>
          {result.data.map(order => (
            
            <OrderCard key={order.id} order={order}/>
          ))}
        </div>
      ) : 
        <p className="text-center py-10 text-2xl font-semibold">No hay ordenes pendientes</p>
      }
    </>
  )
}
