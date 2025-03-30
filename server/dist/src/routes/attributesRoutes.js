"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attributesControllers_1 = require("../controllers/attributesControllers");
const router = (0, express_1.Router)();
router.get("/category/:categoryId", attributesControllers_1.getAttributesByCategory);
router.get("/:attributeId/values", attributesControllers_1.getValuesByAttribute);
exports.default = router;
