import { Router } from "express";
import { requiredRole, verifyJWT } from "../middlewares/auth-middlewares";
import {
  createRating,
  editRating,
  getRatingsbyStoreId,
} from "../controllers/rating-controllers";
import { validator } from "../middlewares/validation-middlewares";
import {
  createRatingBodySchema,
  editRatingBodySchema,
  ratingIdParamSchema,
} from "../validations/rating-validations";
import { storeIdParamSchema } from "../validations/store-validations";

const ratingRouter = Router();

ratingRouter.use(verifyJWT, requiredRole(["USER", "STORE_OWNER"]));

ratingRouter.get("/:storeId", getRatingsbyStoreId);

ratingRouter.post(
  "/:storeId",
  validator({
    paramsParser: storeIdParamSchema,
    bodyParser: createRatingBodySchema,
  }),
  createRating,
);

ratingRouter.patch(
  "/:ratingId",
  validator({
    paramsParser: ratingIdParamSchema,
    bodyParser: editRatingBodySchema,
  }),
  editRating,
);

export default ratingRouter;
