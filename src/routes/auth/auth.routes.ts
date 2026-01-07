import Router from "express"
import { handleUserLogin, handleUserLogout, handleUserRegisteration } from "../../controllers/auth/auth.controller.ts";

const route = Router();

route.post("/register", handleUserRegisteration);
route.post("/login", handleUserLogin);
route.post("/logout", handleUserLogout);

export default route