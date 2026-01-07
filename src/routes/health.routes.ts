import Router from "express";
import { healthController } from "../controllers/health-controller.ts";

const route = Router();

route.get("/", healthController)

export default route;