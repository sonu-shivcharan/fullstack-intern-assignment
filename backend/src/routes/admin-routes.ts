import { Router } from "express";
import {
  createUser,
  createStore,
  getAllUsers,
  adminDashboard,
} from "../controllers/admin-controllers";
import { validator } from "../middlewares/validation-middlewares";
import { signupSchema as createUserSchema } from "../validations/auth-validations";
import { storeCreateSchema } from "../validations/store-validations";
import { getUsersQuerySchema } from "../validations/admin-validations";
import { verifyJWT, verifyAdmin } from "../middlewares/auth-middlewares";

const adminRouter = Router();

adminRouter.use(verifyJWT, verifyAdmin);

adminRouter.get(
  "/users",
  validator({ queryParser: getUsersQuerySchema }),
  getAllUsers,
);

adminRouter.post(
  "/users",
  validator({ bodyParser: createUserSchema }),
  createUser,
);

adminRouter.post(
  "/stores",
  validator({ bodyParser: storeCreateSchema }),
  createStore,
);

adminRouter.get("/dashboard", adminDashboard);

export default adminRouter;
