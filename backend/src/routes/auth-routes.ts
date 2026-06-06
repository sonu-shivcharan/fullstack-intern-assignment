import { Router } from "express";
import {
  getCurrentUser,
  logout,
  changePassword,
  signin,
  signupNormalUser,
} from "../controllers/auth-controllers";
import { validator } from "../middlewares/validation-middlewares";
import {
  signinSchema,
  signupSchema,
  changePasswordSchema,
} from "../validations/auth-validations";
import { verifyJWT } from "../middlewares/auth-middlewares";

const authRouter = Router();

// registers user with role "USER" which is normal user
authRouter.post(
  "/users/signup",
  validator({ bodyParser: signupSchema }),
  signupNormalUser,
);

// single route for login user all users
authRouter.post("/signin", validator({ bodyParser: signinSchema }), signin);

//protected routes
authRouter.get("/me", verifyJWT, getCurrentUser);
authRouter.post("/logout", verifyJWT, logout);
authRouter.patch(
  "/change-password",
  verifyJWT,
  validator({ bodyParser: changePasswordSchema }),
  changePassword,
);

export default authRouter;
