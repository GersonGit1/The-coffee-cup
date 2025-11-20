import { create } from "zustand";
import { currentOrderType, OrderItem } from "./types";
import { Product } from "@prisma/client";

interface Store {
    order: OrderItem[];
    currentOrder: currentOrderType | null;
    setCurrentOrder: (order: currentOrderType | null) => void;
    addToOrder: (product: Product) => void;
    increaseQuantity: (productId: Product['id']) => void;
    decreaseQuantity: (productId: Product['id']) => void;
    removeFromOrder: (productId: Product['id']) => void;
    clearCurrentOrderIfFinished: (status: string) => void;
    updateCurrentOrderStatus: (status: string) => void;
    clearOrder: () => void;
}

export const useStore = create<Store>((set, get) => ({
    order: [],
    currentOrder: null,
    setCurrentOrder: (order) => {
        set(() => ({ currentOrder: order }));
    },
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
    clearCurrentOrderIfFinished: (status) => {
        console.log(status);
        
        if (["ready", "canceled"].includes(status)) {
            console.log('seteando null');
            
            set(() => ({ currentOrder: null }));
        }
    },
    updateCurrentOrderStatus: (status) => {
        console.log('change status to: ',status);
        
        set((state) => state.currentOrder 
            ? { currentOrder: { ...state.currentOrder, status } } 
            : {}
        );
    },
    clearOrder: () => {
        set(()=>({
            order : []
        }))
    }
}));