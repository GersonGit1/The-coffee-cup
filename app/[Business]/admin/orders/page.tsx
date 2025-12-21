"use client"
import OrderCard from '@/components/order/OrderCard';
import Heading from '@/components/ui/Heading'
import Spinner from '@/components/ui/Spinner';
import { useBusiness } from '@/src/context/BusinessContextType';
import { usePendingOrders } from '@/src/hooks/usePendingOrders';
import { OrderWhitProductSchema } from '@/src/schema';

export default function Orders() {
  const business = useBusiness();
  const {data, error, isLoading} = usePendingOrders(business.id, business.slug);
  
  const result = OrderWhitProductSchema.safeParse(data);
  console.log(result);
  
  if(isLoading) return <Spinner/>
  if (error) console.log('Error fetching orders: ', error);
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
