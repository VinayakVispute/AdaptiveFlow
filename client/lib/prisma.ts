/* lib/db.js */
import { PrismaClient } from "@prisma/client";

declare global {
  //   eslint-disable-next-line no-var
  var prisma: PrismaClient;
}

if (!global.prisma) {
  console.log("Creating new Prisma Client");
  global.prisma = new PrismaClient({});
} else {
  console.log("Using existing Prisma Client");
}

export default global.prisma;
