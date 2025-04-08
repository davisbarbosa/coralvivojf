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
        categoryId: parseInt(categoryId),
      },
      include: {
        values: true, // Include values even if they are empty
      },
    });

    if (!attributes.length) {
      res.status(404).json({ message: "No attributes found for this category" });
      return;
    }

    const formattedAttributes = attributes.map(attr => ({
      attributeId: attr.attributeId,
      name: attr.name,
      categoryId: attr.categoryId,
      values: attr.values.map(val => ({
        valueId: val.valueId,
        value: val.value,
      })),
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

export const createAttribute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, categoryId } = req.body;
    const newAttribute = await prisma.attributes.create({
      data: {
        name,
        categoryId: parseInt(categoryId),
      },
    });
    res.status(201).json(newAttribute);
  } catch (error) {
    console.error('Error creating attribute:', error);
    res.status(500).json({ message: "Error creating attribute" });
  }
};

export const updateAttribute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { attributeId } = req.params;
    const { name, categoryId } = req.body;
    const updatedAttribute = await prisma.attributes.update({
      where: { attributeId: parseInt(attributeId) },
      data: {
        name,
        categoryId: parseInt(categoryId),
      },
    });
    res.json(updatedAttribute);
  } catch (error) {
    console.error('Error updating attribute:', error);
    res.status(500).json({ message: "Error updating attribute" });
  }
};

export const deleteAttribute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { attributeId } = req.params;
    await prisma.attributes.delete({
      where: { attributeId: parseInt(attributeId) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting attribute:', error);
    res.status(500).json({ message: "Error deleting attribute" });
  }
};

export const getAttributeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { attributeId } = req.params;
    const attribute = await prisma.attributes.findUnique({
      where: { attributeId: parseInt(attributeId) },
      include: {
        values: true,
      },
    });

    if (!attribute) {
      res.status(404).json({ message: "Attribute not found" });
      return;
    }

    res.json(attribute);
  } catch (error) {
    console.error('Error fetching attribute:', error);
    res.status(500).json({ message: "Error retrieving attribute" });
  }
};

export const getAllAttributes = async (req: Request, res: Response): Promise<void> => {
  try {
    const attributes = await prisma.attributes.findMany({
      include: {
        values: {
          select: {
            valueId: true,
            value: true,
          },
        },
      },
    });

    const formattedAttributes = attributes.map(attr => ({
      attributeId: attr.attributeId,
      name: attr.name,
      categoryId: attr.categoryId,
      values: attr.values.map(val => ({
        valueId: val.valueId,
        value: val.value,
      })),
    }));

    res.json(formattedAttributes);
  } catch (error) {
    console.error('Error fetching all attributes:', error);
    res.status(500).json({ message: "Error retrieving attributes" });
  }
};
