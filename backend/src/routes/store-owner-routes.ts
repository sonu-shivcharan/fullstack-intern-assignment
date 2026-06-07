import { Router } from "express";
import { requiredRole, verifyJWT } from "../middlewares/auth-middlewares";
import {
  getUserByStoreId,
  storeOwnerDashBoard,
} from "../controllers/store-owner-controllers";

const storeOwnerRouter = Router();

storeOwnerRouter.use(verifyJWT, requiredRole(["STORE_OWNER"]));

storeOwnerRouter.get("/dashboard", storeOwnerDashBoard);

storeOwnerRouter.get("/users", getUserByStoreId);

export default storeOwnerRouter;
