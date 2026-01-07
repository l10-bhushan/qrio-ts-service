import "dotenv/config"
import express from "express";
import { connectDB , prisma , disconnectDB } from "./config/db.ts"
import healthRoute from "./routes/health.routes.ts"
import authRoute from "./routes/auth/auth.routes.ts"

const app = express();
const PORT = process.env.PORT!;

app.use(express.json())
app.use("/health", healthRoute)
app.use("/auth", authRoute)

connectDB();

const server = app.listen(PORT , () => {
    console.log(`Server up and running on PORT : ${PORT}`);
});

// Handle db connect error
process.on("unhandledRejection" , async(error : any) => {
    console.error("UNHANDLED REJECTION 💥");
    console.error(error.name, error.message);
    console.error(error.stack);
    server?.close(async() => {
        await disconnectDB();
        process.exit(1);
    });
});

// Handle uncaught exception
process.on("uncaughtException" , async(error : any) => {
    console.error("UNCAUGHT EXCEPTION 💥");
    console.error(error.name, error.message);
    console.error(error.stack);
    await disconnectDB();
    process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async (err) => {
  console.error("SIGTERM : ", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});