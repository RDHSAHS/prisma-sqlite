import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function enableForeignKeys() {
  try {
    await prisma.$executeRaw`PRAGMA foreign_keys = ON`;
    console.log(`FK ENABLED`);
  } catch (err) {
    console.error(`ERROR ENABLING FK`);
  } finally {
    await prisma.$disconnect();
  }
}

export default prisma;
