"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryControllers_1 = require("../controllers/categoryControllers");
const router = (0, express_1.Router)();
router.get("/", categoryControllers_1.getCategories);
exports.default = router;
