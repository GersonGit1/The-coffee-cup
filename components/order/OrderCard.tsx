import { changeStatusOrder } from "@/actions/change-status-order-action";
import { OrderWhitProducts } from "@/src/types";
import { formatCurrency } from "@/src/utils/currency";

type OrderCardProps = {
    order: OrderWhitProducts[0];
}
export default function OrderCard({ order } : OrderCardProps) {
    return (
        <section
            aria-labelledby="summary-heading"
            className="flex flex-col mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:mt-0 lg:p-8"
            >
            <div>
                <p className='text-2xl font-medium text-gray-900'>Cliente: {order.name}</p>
                <p className='text-lg font-medium text-gray-900'>Productos Ordenados:</p>

                <dl className="mt-6 space-y-4">
                {order.OrderProducts.map(orderProduct => (
                    <div key={orderProduct.id} className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="flex items-center text-sm text-gray-600">
                        <span className="font-black">({orderProduct.quantity}) </span>
                    </dt>
                    <dd className="text-sm font-medium text-gray-900">{orderProduct.product.name}</dd>
                    </div>
                ))}
                </dl>
            </div>

            {/* --- PUSH TO BOTTOM --- */}
            <div className="mt-auto pt-6">
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Total a Pagar:</dt>
                <dd className="text-base font-medium text-gray-900">{formatCurrency(order.total)}</dd>
                </div>

                <form action={changeStatusOrder}>
                <input type="hidden" name="orderId" value={order.id} />
                <input type="hidden" name="orderStatus" value={order.status} />
                <input
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3 rounded-lg uppercase font-bold cursor-pointer"
                    value={order.status === "pending" ? "Preparar orden" : "Completar orden"}
                />
                </form>
            </div>
        </section>

    )
}