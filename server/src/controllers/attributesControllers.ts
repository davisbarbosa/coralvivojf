import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAttributesByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const attributes = await prisma.attributes.findMany({
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
  } catch (error) {
    console.error('Error fetching attributes:', error);
    res.status(500).json({ message: "Error retrieving attributes" });
  }
};

export const getValuesByAttribute = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { attributeId } = req.params;
    const values = await prisma.attributes.findMany({
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
  } catch (error) {
    console.error('Error fetching attribute values:', error);
    res.status(500).json({ message: "Error retrieving attribute values" });
  }
};
