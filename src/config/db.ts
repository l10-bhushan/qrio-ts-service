import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "production"
      ? ["error"]
      : ["error", "query", "warn"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("DB connected successfully via PRISMA");
  } catch (err) {
    console.log(`Error : ${err}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

export { connectDB, disconnectDB, prisma };
