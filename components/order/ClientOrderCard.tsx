import { cancelOrder } from "@/actions/cancel-order-action";
import { currentOrderType } from "@/src/types";

interface Props {
  order: currentOrderType;
  removeActiveOrder: (orderId: string) => void;
}

export function ClientOrderCard({ order, removeActiveOrder }: Props) {
  const cancel = async () => {
    const result = await cancelOrder(order.id);
    if (result.success) {
      removeActiveOrder(order.id);
    }
  }
  
  return (
    <div className="p-5 border rounded-xl mt-5 space-y-3">
      <h2 className="text-xl font-bold">Pedido # {order.id.toString().substring(0, 8)}</h2>

      <p className="text-gray-700 font-semibold">
        Estado: <span className="capitalize">{order.status}</span>
      </p>

      <ul className="space-y-2">
        {order.OrderProducts.map(op => (
          <li key={op.id} className="flex justify-between">
            <span>{op.product.name}</span>
            <span>x{op.quantity}</span>
          </li>
        ))}
      </ul>

      {order.status === "pending" && (
        <button 
          onClick={cancel}
          className="w-full bg-red-600 text-white py-2 rounded-lg cursor-pointer"
        >
          Cancelar pedido
        </button>
      )}
    </div>
  );
}
