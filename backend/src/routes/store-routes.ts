import { Router } from "express";
import { verifyJWT } from "../middlewares/auth-middlewares";
import { getAllStores, getStoreById } from "../controllers/stores-controller";
import { validator } from "../middlewares/validation-middlewares";
import {
  getStoresQuerySchema,
  storeIdParamSchema,
} from "../validations/store-validations";

const storeRouter = Router();

storeRouter.use(verifyJWT);

storeRouter.get(
  "/",
  validator({ queryParser: getStoresQuerySchema }),
  getAllStores,
);

storeRouter.get(
  "/:storeId",
  validator({ paramsParser: storeIdParamSchema }),
  getStoreById,
);

export default storeRouter;
