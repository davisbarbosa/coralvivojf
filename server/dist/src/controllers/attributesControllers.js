"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValuesByAttribute = exports.getAttributesByCategory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAttributesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        const attributes = yield prisma.attributes.findMany({
            where: {
                categoryId: parseInt(categoryId)
            },
            include: {
                values: {
                    select: {
                        valueId: true,
                        value: true
                    }
                }
            }
        });
        if (!attributes.length) {
            res.status(404).json({ message: "No attributes found for this category" });
            return;
        }
        const formattedAttributes = attributes.map(attr => ({
            attributeId: attr.attributeId,
            name: attr.name,
            values: attr.values.map(val => ({
                valueId: val.valueId,
                value: val.value
            }))
        }));
        res.json(formattedAttributes);
    }
    catch (error) {
        console.error('Error fetching attributes:', error);
        res.status(500).json({ message: "Error retrieving attributes" });
    }
});
exports.getAttributesByCategory = getAttributesByCategory;
const getValuesByAttribute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { attributeId } = req.params;
        const values = yield prisma.attributes.findMany({
            where: {
                attributeId: parseInt(attributeId)
            },
            select: {
                values: true
            }
        });
        if (!values.length) {
            res.status(404).json({ message: "No values found for this attribute" });
            return;
        }
        const formattedValues = values.map(val => ({
            values: val.values,
        }));
        res.json(formattedValues);
    }
    catch (error) {
        console.error('Error fetching attribute values:', error);
        res.status(500).json({ message: "Error retrieving attribute values" });
    }
});
exports.getValuesByAttribute = getValuesByAttribute;
