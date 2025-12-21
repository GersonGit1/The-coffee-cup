import z from "zod";

export const OrderWhitProductSchema = z.object({
  name: z.string(),
  total: z.number(),
  date: z.string(),
  id: z.cuid({
            message: "id must be a valid CUID",
        }),
  status: z.string(),
  readyAt: z.string().nullable(),
  OrderProducts: z.array(
    z.object({
      id: z.cuid({
            message: "id must be a valid CUID",
        }),
      quantity: z.number(),
      orderId: z.cuid({
            message: "OrderId must be a valid CUID",
        }),
      productId: z.cuid({
            message: "productId must be a valid CUID",
        }),
      product: z.object({
        name: z.string(),
        id: z.cuid({
            message: "id must be a valid CUID",
        }),
        price: z.number(),
        categoryId: z.cuid({
            message: "id must be a valid CUID",
        }),
        BusinessId : z.cuid({
            message: "BusinessId must be a valid CUID",
        }),
        image: z.string(),
      })
    })
  )
}).array();

export const OrderSchema = z.object({
    name: z.string().min(1, "name is required"),
    total: z.number().min(1, "total must be greater than 0"),
    order: z.array(z.object({
        id: z.cuid({
            message: "OrderId must be a valid CUID",
        }),
        BusinessId: z.cuid({
            message: "BusinessId must be a valid CUID",
        }),
        name: z.string(),
        quantity: z.number().min(1, "quantity must be at least 1"),
        price: z.number().min(1, "price must be greater than 0"),
        subtotal: z.number().min(1, "subtotal must be greater than 0"),
    })).min(1, "order must have at least one item"),
});

export const OrderCardSchema = z.object({
    OrderId: z.cuid({
        message: "OrderId must be a valid CUID",
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
    categoryId: z.cuid({
        message: "OrderId must be a valid CUID",
    }),
    BusinessId: z.cuid({
        message: "OrderId must be a valid CUID",
    }),
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
    categoryId: z.cuid({
        message: "OrderId must be a valid CUID",
    }),
    BusinessId: z.cuid({
        message: "OrderId must be a valid CUID",
    }),
    image: z.string()
        .trim()
        .min(1, { message: 'Image is required' }),
    imagePublicId: z.string().nullable()
});

export const CategorySchema = z.object({
    name: z.string()
        .trim()
        .min(1, { message: 'Category name is required' }),
    slug: z.string(),
    BusinessId: z.cuid({
        message: "BusinessId must be a valid CUID",
    }),
});

export const CategoryIconSchema = z.object({
    name: z.string()
        .trim()
        .min(1, { message: 'Category name is required' }),
    slug: z.string(),
    id: z.cuid({
        message: "Id must be a valid CUID",
    }),
}).array();

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password actual requerida"),
    newPassword: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

export const ProductMenuSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  id: z.cuid2("ID inválido"),
  price: z.number(),
  categoryId: z.cuid2(),
  BusinessId: z.cuid2(),
  image: z.string().url("Debe ser una URL válida"),
  imagePublicId: z.string().nullable(),
  isAvailable: z.boolean(),
  isDeleted: z.boolean(),
  deletedAt: z.date().nullable(),
}).array();

export const ProductMenuWhitCategorySlugSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  id: z.cuid2("ID inválido"),
  price: z.number(),
  categoryId: z.cuid2(),
  BusinessId: z.cuid2(),
  image: z.string().url("Debe ser una URL válida"),
  imagePublicId: z.string().nullable(),
  isAvailable: z.boolean(),
  isDeleted: z.boolean(),
  deletedAt: z.date().nullable(),
  category : z.object({
    slug: z.string()
  })
});

export const ParamString = z.object({
    param : z.string().min(1, "El parámetro es requerido")
});