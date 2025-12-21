import { Product } from "@/generated/prisma/client";
import z from "zod";
import { OrderWhitProductSchema } from "../schema";

export type OrderItem = Pick<Product, "id" | "name" | "price" | "BusinessId"> & {
  quantity: number;
  subtotal: number;
};

export type BusinessContextType = {
  id: string;
  slug: string;
  nombre: string;
  logo?: string | null;
};

export type CategoryToSidebar = {
  id: string;
  name: string;
  slug: string;
};


export type OrderWhitProducts = z.infer<typeof OrderWhitProductSchema>;

export type currentOrderType = {
        OrderProducts: ({
            product: {
                name: string;
                id: string;
                BusinessId: string;
                price: number;
                image: string;
                categoryId: string;
                imagePublicId: string | null;
                isDeleted: boolean;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            quantity: number;
            orderId: string;
            //BusinessId: string;
            productId: string;
        })[];
    } & {
        name: string;
        id: string;
        total: number;
        date: Date;
        status: string;
        readyAt: Date | null;
}