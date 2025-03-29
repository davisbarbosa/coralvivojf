import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Types
interface CreateProductBody {
  name: string;
  price: string;
  stockQuantity: string;
  categoryId: string;
  imageUrl: string;
  discountPrice?: string;
  onSale?: boolean;
  attributes?: Array<{ valueId: string }>;
}

interface UpdateProductBody extends Partial<CreateProductBody> {
  productId: string;
}

interface FormattedAttribute {
  attributeId: string;
  attributeName: string;
  attributeValue: string;
}

// Formatting helpers
const formatProduct = (product: any) => ({
  productId: product.productId,
  name: product.name,
  price: product.price.toString(),
  rating: product.rating,
  stockQuantity: product.stockQuantity,
  discountPrice: product.discountPrice?.toString(),
  onSale: product.onSale,
  categoryId: product.categoryId,
  imageUrl: product.imageUrl,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
  category: product.category,
  attributes: product.productAttributes?.map((pa: any) => ({
    attributeId: pa.value.attribute.attributeId.toString(),
    attributeName: pa.value.attribute.name,
    attributeValue: pa.value.value,
  })),
});

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
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();

    const products = await prisma.products.findMany({
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
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prisma.products.findUnique({
      where: { productId: id },
      include: productInclude,
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.json(formatProduct(product));
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: "Error retrieving product" });
  }
};

export const getProductByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const products = await prisma.products.findMany({
      where: { categoryId: parseInt(id) },
      include: productInclude,
    });

    if (!products.length) {
      res.status(404).json({ message: "No products found in this category" });
      return;
    }

    res.json(products.map(formatProduct));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (
  req: Request<{}, {}, CreateProductBody>,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      price,
      stockQuantity,
      categoryId,
      imageUrl,
      attributes,
      discountPrice,
      onSale,
    } = req.body;

    // Generate a random product ID (you might want to adjust this logic)
    const productId = `PROD${Math.random().toString(36).substr(2, 9)}`.toUpperCase();

    const product = await prisma.products.create({
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

    if (attributes?.length) {
      await prisma.productAttributes.createMany({
        data: attributes.map(attr => ({
          productId: product.productId,
          valueId: parseInt(attr.valueId),
        })),
      });
    }

    const createdProduct = await prisma.products.findUnique({
      where: { productId: product.productId },
      include: productInclude,
    });

    if (!createdProduct) {
      res.status(404).json({ message: "Product not found after creation" });
      return;
    }

    res.status(201).json(formatProduct(createdProduct));
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(400).json({ message: "Product ID already exists" });
        return;
      }
    }
    res.status(500).json({ message: "Error creating product" });
  }
};

export const updateProduct = async (
  req: Request<{ id: string }, {}, UpdateProductBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      stockQuantity,
      categoryId,
      imageUrl,
      attributes,
      discountPrice,
      onSale,
    } = req.body;

    // First update the product
    const updatedProduct = await prisma.products.update({
      where: { productId: id },
      data: {
        ...(name && { name }),
        ...(price && { price: parseFloat(price) }),
        ...(stockQuantity && { stockQuantity: parseInt(stockQuantity) }),
        ...(categoryId && {
          category: { connect: { categoryId: parseInt(categoryId) } }
        }),
        ...(imageUrl && { imageUrl }),
        ...(discountPrice && { discountPrice: parseFloat(discountPrice) }),
        ...(onSale !== undefined && { onSale: Boolean(onSale) }),
      },
      include: productInclude,
    });

    // If attributes are provided, update them
    if (attributes?.length) {
      // First remove existing attributes
      await prisma.productAttributes.deleteMany({
        where: { productId: id },
      });

      // Then add new attributes
      await prisma.productAttributes.createMany({
        data: attributes.map(attr => ({
          productId: id,
          valueId: parseInt(attr.valueId),
        })),
      });
    }

    // Fetch the final product with updated attributes
    const finalProduct = await prisma.products.findUnique({
      where: { productId: id },
      include: productInclude,
    });

    if (!finalProduct) {
      res.status(404).json({ message: "Product not found after update" });
      return;
    }

    res.json(formatProduct(finalProduct));
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({ message: "Product not found" });
        return;
      }
    }
    res.status(500).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.products.delete({
      where: { productId: id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({ message: "Product not found" });
        return;
      }
    }
    res.status(500).json({ message: "Error deleting product" });
  }
};