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
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductByCategory = exports.getProductById = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Formatting helpers
const formatProduct = (product) => {
    var _a, _b;
    return ({
        productId: product.productId,
        name: product.name,
        price: product.price.toString(),
        rating: product.rating,
        stockQuantity: product.stockQuantity,
        discountPrice: (_a = product.discountPrice) === null || _a === void 0 ? void 0 : _a.toString(),
        onSale: product.onSale,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        category: product.category,
        attributes: (_b = product.productAttributes) === null || _b === void 0 ? void 0 : _b.map((pa) => ({
            attributeId: pa.value.attribute.attributeId.toString(),
            attributeName: pa.value.attribute.name,
            attributeValue: pa.value.value,
        })),
    });
};
// Product include configuration for queries
const productInclude = {
    category: {
        select: {
            categoryId: true,
            name: true,
        },
    },
    productAttributes: {
        include: {
            value: {
                include: {
                    attribute: true,
                },
            },
        },
    },
};
// Controllers
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const products = yield prisma.products.findMany({
            where: search ? {
                name: {
                    contains: search,
                    mode: 'insensitive',
                },
            } : undefined,
            include: productInclude,
        });
        const formattedProducts = products.map(formatProduct);
        res.json(formattedProducts);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: "Error retrieving products" });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield prisma.products.findUnique({
            where: { productId: id },
            include: productInclude,
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.json(formatProduct(product));
    }
    catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: "Error retrieving product" });
    }
});
exports.getProductById = getProductById;
const getProductByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const products = yield prisma.products.findMany({
            where: { categoryId: parseInt(id) },
            include: productInclude,
        });
        if (!products.length) {
            res.status(404).json({ message: "No products found in this category" });
            return;
        }
        res.json(products.map(formatProduct));
    }
    catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: "Error retrieving products" });
    }
});
exports.getProductByCategory = getProductByCategory;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, stockQuantity, categoryId, imageUrl, attributes, discountPrice, onSale, } = req.body;
        // Generate a random product ID (you might want to adjust this logic)
        const productId = `PROD${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
        const product = yield prisma.products.create({
            data: {
                productId,
                name,
                price: parseFloat(price),
                stockQuantity: parseInt(stockQuantity),
                category: {
                    connect: { categoryId: parseInt(categoryId) }
                },
                imageUrl,
                discountPrice: discountPrice ? parseFloat(discountPrice) : null,
                onSale: Boolean(onSale),
                rating: 0,
            },
            include: productInclude,
        });
        if (attributes === null || attributes === void 0 ? void 0 : attributes.length) {
            yield prisma.productAttributes.createMany({
                data: attributes.map(attr => ({
                    productId: product.productId,
                    valueId: parseInt(attr.valueId),
                })),
            });
        }
        const createdProduct = yield prisma.products.findUnique({
            where: { productId: product.productId },
            include: productInclude,
        });
        if (!createdProduct) {
            res.status(404).json({ message: "Product not found after creation" });
            return;
        }
        res.status(201).json(formatProduct(createdProduct));
    }
    catch (error) {
        console.error('Error creating product:', error);
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                res.status(400).json({ message: "Product ID already exists" });
                return;
            }
        }
        res.status(500).json({ message: "Error creating product" });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, price, stockQuantity, categoryId, imageUrl, attributes, discountPrice, onSale, } = req.body;
        // First update the product
        const updatedProduct = yield prisma.products.update({
            where: { productId: id },
            data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (name && { name })), (price && { price: parseFloat(price) })), (stockQuantity && { stockQuantity: parseInt(stockQuantity) })), (categoryId && {
                category: { connect: { categoryId: parseInt(categoryId) } }
            })), (imageUrl && { imageUrl })), (discountPrice && { discountPrice: parseFloat(discountPrice) })), (onSale !== undefined && { onSale: Boolean(onSale) })),
            include: productInclude,
        });
        // If attributes are provided, update them
        if (attributes === null || attributes === void 0 ? void 0 : attributes.length) {
            // First remove existing attributes
            yield prisma.productAttributes.deleteMany({
                where: { productId: id },
            });
            // Then add new attributes
            yield prisma.productAttributes.createMany({
                data: attributes.map(attr => ({
                    productId: id,
                    valueId: parseInt(attr.valueId),
                })),
            });
        }
        // Fetch the final product with updated attributes
        const finalProduct = yield prisma.products.findUnique({
            where: { productId: id },
            include: productInclude,
        });
        if (!finalProduct) {
            res.status(404).json({ message: "Product not found after update" });
            return;
        }
        res.json(formatProduct(finalProduct));
    }
    catch (error) {
        console.error('Error updating product:', error);
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                res.status(404).json({ message: "Product not found" });
                return;
            }
        }
        res.status(500).json({ message: "Error updating product" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.products.delete({
            where: { productId: id },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting product:', error);
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                res.status(404).json({ message: "Product not found" });
                return;
            }
        }
        res.status(500).json({ message: "Error deleting product" });
    }
});
exports.deleteProduct = deleteProduct;
