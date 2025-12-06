import AddProductForm from "@/components/product/AddProductForm";
import ProductForm from "@/components/product/ProductForm";
import Heading from "@/components/ui/Heading";

export const dynamic = 'force-dynamic';
export default function page() {
  return (
    <>
      <Heading>
        Nuevo Producto
      </Heading>

      <AddProductForm>
        <ProductForm />
      </AddProductForm>
    </>
  )
}
