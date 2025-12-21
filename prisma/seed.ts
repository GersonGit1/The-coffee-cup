import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })

const prisma =  new PrismaClient({ adapter });

async function main() {
    try {
        // await prisma.business.create({
        //     data: {
        //     nombre: "Comedor La Esquina",
        //     slug: "comedor_la_esquina",
        //     logo: null,
        //     users: {
        //         create: [
        //         {
        //             name: "Admin La Esquina",
        //             email: "admin@laesquina.com",
        //             password: await bcrypt.hash('theCoffeeCup', 10),
        //         }
        //         ]
        //     }
        //     }
        // });
        await prisma.business.create({
            data: {
            nombre: "Comedor Juanito",
            slug: "comedor_juanito",
            logo: null,
            users: {
                create: [
                {
                    name: "Admin Juanito",
                    email: "admin@juanito.com",
                    password: await bcrypt.hash('theCoffeeCup', 10),
                }
                ]
            }
            }
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