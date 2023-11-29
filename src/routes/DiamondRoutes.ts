import { Router } from "express";
import DiamondControllers from "../controllers/DiamondControllers";
import { jwtAuth } from "../middlewares/jwtAuth";

const DiamondRoutes = Router();

// PUT | /winning-diamond
DiamondRoutes.put("/winning-diamond", jwtAuth, DiamondControllers.winningDiamond);

export default DiamondRoutes;
