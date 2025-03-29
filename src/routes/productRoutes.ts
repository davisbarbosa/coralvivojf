import { Router } from "express";
import { 
  createProduct, 
  getProducts, 
  getProductById,
  getProductByCategory, 
  updateProduct, 
  deleteProduct 
} from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.get("/category/:id", getProductByCategory);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;