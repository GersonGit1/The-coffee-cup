import { Product } from "@/generated/prisma/client";
import z from "zod";
import { OrderWhitProductSchema } from "../schema";

export type OrderItem = Pick<Product, "id" | "name" | "price"> & {
  quantity: number;
  subtotal: number;
};

export type OrderWhitProducts = z.infer<typeof OrderWhitProductSchema>;

export type currentOrderType = {
        OrderProducts: ({
            product: {
                name: string;
                id: number;
                price: number;
                image: string;
                categoryId: number;
                imagePublicId: string | null;
                isDeleted: boolean;
                deletedAt: Date | null;
            };
        } & {
            id: number;
            quantity: number;
            orderId: number;
            productId: number;
        })[];
    } & {
        name: string;
        id: number;
        total: number;
        date: Date;
        status: string;
        readyAt: Date | null;
}