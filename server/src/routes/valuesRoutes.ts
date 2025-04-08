import { Router } from "express";
import {
  getAllValues,
  getValueById,
  createValue,
  updateValue,
  deleteValue,
} from "../controllers/valuesControllers";

const router = Router();

router.get("/", getAllValues);
router.get("/:valueId", getValueById);
router.post("/", createValue);
router.put("/:valueId", updateValue);
router.delete("/:valueId", deleteValue);

export default router;
