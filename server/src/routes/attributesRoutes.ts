import { Router } from "express";
import { getAttributesByCategory, getValuesByAttribute } from "../controllers/attributesControllers";

const router = Router();

router.get("/category/:categoryId", getAttributesByCategory);
router.get("/:attributeId/values", getValuesByAttribute);

export default router;
