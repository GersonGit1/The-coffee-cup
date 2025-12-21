import { create } from "zustand";
import { currentOrderType, OrderItem } from "./types";
import { Product } from "@/generated/prisma/client";

interface Store {
    order: OrderItem[];
    activeOrders: currentOrderType[];
    addActiveOrder: (order: currentOrderType) => void;
    updateOrderStatus: (orderId: string, status: string) => void;
    removeActiveOrder: (orderId: string) => void;
    addToOrder: (product: Product) => void;
    increaseQuantity: (productId: Product['id']) => void;
    decreaseQuantity: (productId: Product['id']) => void;
    removeFromOrder: (productId: Product['id']) => void;
    clearOrder: () => void;
}

export const useStore = create<Store>((set, get) => ({
    order: [],
    activeOrders: [],
    addActiveOrder: (order) =>
    set(state => ({
      activeOrders: [...state.activeOrders, order]
    })),
    updateOrderStatus: (orderId, status) =>
        set(state => ({
        activeOrders: state.activeOrders.map(o =>
            o.id === orderId ? { ...o, status } : o
        )
    })),
    removeActiveOrder: (orderId) =>
        set(state => ({
        activeOrders: state.activeOrders.filter(o => o.id !== orderId)
    })),
    addToOrder: (product: Product) =>{
        const {categoryId, image, ...data} = product;
        let order : OrderItem[] = [];
        if (get().order.find(item => item.id === product.id)) {
            order = get().order.map(item => item.id === product.id ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: product.price * (item.quantity + 1)
            } : item);
        } else {
            order = [...get().order, 
                {...data, quantity: 1,
                    subtotal: product.price * 1
                }]
        }

        set(()=>({
            order 
        }))
    },
    increaseQuantity: (productId: Product['id']) => {
        set((state)=>({
            order : state.order.map(item => item.id === productId ? {
            ...item,
            quantity: item.quantity + 1,
            subtotal: item.price * (item.quantity + 1)
        } : item)
        }))
    },
    decreaseQuantity: (productId: Product['id']) => {
        set((state)=>({
            order : state.order.map(item => item.id === productId ? {
            ...item,
            quantity: item.quantity - 1,
            subtotal: item.price * (item.quantity - 1)
        } : item)
        }))
    },
    removeFromOrder: (productId: Product['id']) => {
        set((state)=>({
            order : state.order.filter(item => item.id !== productId)
        }))
    },
    clearOrder: () => {
        set(()=>({
            order : []
        }))
    }
}));