import { Router } from "express";
import { getAttributesByCategory, getValuesByAttribute, createAttribute, updateAttribute, deleteAttribute, getAttributeById, getAllAttributes } from "../controllers/attributesControllers";

const router = Router();

router.get("/category/:categoryId", getAttributesByCategory);
router.get("/:attributeId/values", getValuesByAttribute);
router.post("/", createAttribute);
router.put("/:attributeId", updateAttribute);
router.delete("/:attributeId", deleteAttribute);
router.get("/:attributeId", getAttributeById);
router.get("/", getAllAttributes);

export default router;
