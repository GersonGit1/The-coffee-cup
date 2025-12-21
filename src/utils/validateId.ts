import { z } from 'zod';

type Params = {
  id: string;
};

const CUIDSchema = z.object({
  id: z.cuid({
        message: "OrderId must be a valid CUID",
    }),
});

export function validateBusinessId(params: Params): string {
  try {
    const validatedParams = CUIDSchema.parse(params);
    return validatedParams.id;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Error de validación del CUID:", error);
      throw new Error("ID de negocio inválido.");
    }
    throw error;
  }
}