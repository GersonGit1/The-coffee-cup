import { OrderWhitProducts } from "@/src/types"

type props = {
    order: OrderWhitProducts[0]
}
export default function LatestOrderItem({order}:props) {
  return (
    <div className="bg-white shadow p-5 space-y-5 rounded-lg">
        <p className="text-2xl font-bold text-slate-600">Cliente : {order.name}</p>

        <ul role="list" className="divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500">
            {order.OrderProducts.map(product => (
                <li key={product.id} className="flex p-6 text-lg">
                    <span className="font-bold">({product.quantity}) {""}</span>
                    <p>{product.product.name}</p>
                </li>
            ))}
        </ul>
    </div>
  )
}
