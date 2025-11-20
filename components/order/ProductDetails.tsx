import { useStore } from "@/src/store"
import { OrderItem } from "@/src/types"
import { formatCurrency } from "@/src/utils/currency"
import { MinusIcon, PlusIcon, XCircleIcon } from "@heroicons/react/16/solid"
import { useMemo } from "react"

type Props = {
    item: OrderItem
}
const max_items = 10;
const min_items = 1;
export default function ProductDetails({item}: Props) {
    const increaseQuantity = useStore((state) => state.increaseQuantity);
    const decreaseQuantity = useStore((state) => state.decreaseQuantity);
    const removeFromOrder = useStore((state) => state.removeFromOrder);
    const disableDecreaseButton = useMemo(()=> item.quantity === min_items, [item.quantity]);
    const disableIncreaseButton = useMemo(()=> item.quantity === max_items, [item.quantity]);
  return (
    <div className="shadow space-y-1 p-4 bg-white  border-t border-gray-200 ">
        <div className="space-y-4">
            <div className="flex justify-between items-start">
                <p className="text-xl font-bold">{item.name} </p>
                <button
                type="button"
                className="cursor-pointer"
                onClick={() => removeFromOrder(item.id)}
                >
                <XCircleIcon className="text-red-600 h-8 w-8"/>
                </button>
            </div>
            <p className="text-2xl text-amber-500 font-black">
                {formatCurrency(item.price)}
            </p>
            <div className="flex gap-5 px-10 py-2 bg-gray-100 w-fit rounded-lg">
                <button
                type="button"
                className={`${disableDecreaseButton ? '' : 'cursor-pointer'} disabled:opacity-20`}
                onClick={() => decreaseQuantity(item.id)}
                disabled={disableDecreaseButton}
                >
                    <MinusIcon className="h-6 w-6"/>
                </button>

                <p className="text-lg font-black ">
                {item.quantity}
                </p>

                <button
                type="button"
                className={`${disableIncreaseButton ? '' : 'cursor-pointer'} disabled:opacity-20`}
                disabled={disableIncreaseButton}
                onClick={() => increaseQuantity(item.id)}
                >
                    <PlusIcon className="h-6 w-6"/>
                </button>
            </div>
            <p className="text-xl font-black text-gray-700">
                Subtotal: {''}
                <span className="font-normal"> 
                    {formatCurrency(item.subtotal)}
                </span>
            </p>
        </div>
    </div>
  )
}
