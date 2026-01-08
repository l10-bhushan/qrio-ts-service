import Router from "express";
import {
  deleteShortURL,
  fetchAllShortURLs,
  generateShortURL,
  updateShortURL,
} from "../../controllers/shorturl/generateshorturl.controller.ts";
import { authMiddleWare } from "../../middleware/auth.middleware.ts";

const route = Router();

route.use(authMiddleWare);
route.get("/fetch", fetchAllShortURLs);
route.post("/create", generateShortURL);
route.post("/delete", deleteShortURL);
route.post("/update", updateShortURL);

export default route;
