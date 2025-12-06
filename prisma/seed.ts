import { products } from "./data/products";
import { categories } from "./data/categories";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })

const prisma =  new PrismaClient({ adapter });

async function main() {
    try {
        await prisma.category.createMany({
            data: categories
        });
        await prisma.product.createMany({
            data : products
        });
    } catch (error) {
        console.log(error);
    }
}

main()
    .then(async ()=>{
        await prisma.$disconnect();
    })
    .catch(async (error)=>{
        console.log(error);
        await prisma.$disconnect();
        process.exit(1);
    });