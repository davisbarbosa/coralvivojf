import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await prisma.categories.findMany({
      select: {
        categoryId: true,
        name: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    const formattedCategories = categories.map(category => ({
      categoryId: category.categoryId,
      name: category.name
    }));

    res.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: "Error retrieving categories" });
  }
};
