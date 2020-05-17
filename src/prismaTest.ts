import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createUsers = async () => {
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.user.create({
    data: {
      name: "Daniel",
      email: "daniel@email.com",
      password: "123",

      products: {
        create: [
          {
            name: "leite",
            price: 5,
          },
          {
            name: "carne",
            price: 10,
          },
          {
            name: "batata",
            price: 2,
          },
        ],
      },
    },
  });
};

const findUsers = async () => {
  const allUsers = await prisma.user.findMany({
    include: {
      products: true,
    },
  });
  console.log(JSON.stringify(allUsers, null, 1));
};

createUsers();
findUsers();
