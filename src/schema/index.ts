import z from "zod";

export const OrderWhitProductSchema = z.object({
  name: z.string(),
  total: z.number(),
  date: z.string(),
  id: z.number(),
  status: z.string(),
  readyAt: z.string().nullable(),
  OrderProducts: z.array(
    z.object({
      id: z.number(),
      quantity: z.number(),
      orderId: z.number(),
      productId: z.number(),
      product: z.object({
        name: z.string(),
        id: z.number(),
        price: z.number(),
        categoryId: z.number(),
        image: z.string(),
      })
    })
  )
}).array();

export const OrderSchema = z.object({
    name: z.string().min(1, "name is required"),
    total: z.number().min(1, "total must be greater than 0"),
    order: z.array(z.object({
        id: z.number(),
        name: z.string(),
        quantity: z.number().min(1, "quantity must be at least 1"),
        price: z.number().min(1, "price must be greater than 0"),
        subtotal: z.number().min(1, "subtotal must be greater than 0"),
    })).min(1, "order must have at least one item"),
});

export const OrderCardSchema = z.object({
    OrderId: z.string()
                .transform((val) => parseInt(val))
                .refine((val) => !isNaN(val), {
                    message: "OrderId must be a valid number",
                })
                .refine((val) => val > 0, {
                    message: "OrderId must be greater than 0",
                }),
    status: z.enum(["pending", "preparing", "ready", "canceled"]),
});

export const SearchSchema = z.object({
    search: z.string()
        .trim()
        .min(1, "search term is required"),
});

export const ProductSchema = z.object({
    name: z.string()
        .trim()
        .min(1, { message: 'Product name is required' }),
    price: z.string()
        .trim()
        .transform((value) => parseFloat(value)) 
        .refine((value) => value > 0, { message: 'Price is not valid' }),
    categoryId: z.string()
        .trim()
        .transform((value) => parseInt(value)) 
        .refine((value) => value > 0, { message: 'Category is required' }),
    image: z.string()
        .trim()
        .min(1, { message: 'Image is required' }),
    imagePublicId: z.string().nullable()
});

export const ProductSchemaServer = z.object({
    name: z.string()
        .trim()
        .min(1, { message: 'Product name is required' }),
    price: z.number()
        .refine((value) => value > 0, { message: 'Price is not valid' }),
    categoryId: z.number()
        .refine((value) => value > 0, { message: 'Category is required' }),
    image: z.string()
        .trim()
        .min(1, { message: 'Image is required' }),
    imagePublicId: z.string().nullable()
});