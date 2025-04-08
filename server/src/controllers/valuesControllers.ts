import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllValues = async (req: Request, res: Response): Promise<void> => {
  try {
    const values = await prisma.values.findMany();
    res.json(values);
  } catch (error) {
    console.error("Error fetching values:", error);
    res.status(500).json({ message: "Error retrieving values" });
  }
};

export const getValueById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { valueId } = req.params;
    const value = await prisma.values.findUnique({
      where: { valueId: parseInt(valueId) },
    });

    if (!value) {
      res.status(404).json({ message: "Value not found" });
      return;
    }

    res.json(value);
  } catch (error) {
    console.error("Error fetching value:", error);
    res.status(500).json({ message: "Error retrieving value" });
  }
};

export const createValue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { value, attributeId } = req.body;
    const newValue = await prisma.values.create({
      data: {
        value,
        attributeId: parseInt(attributeId),
      },
    });
    res.status(201).json(newValue);
  } catch (error) {
    console.error("Error creating value:", error);
    res.status(500).json({ message: "Error creating value" });
  }
};

export const updateValue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { valueId } = req.params;
    const { value, attributeId } = req.body;
    const updatedValue = await prisma.values.update({ 
      where: { valueId: parseInt(valueId) },
      data: {
        value,
        attributeId: parseInt(attributeId),
      },
    });
    res.json(updatedValue);
  } catch (error) {
    console.error("Error updating value:", error);
    res.status(500).json({ message: "Error updating value" });
  }
};

export const deleteValue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { valueId } = req.params;
    await prisma.values.delete({
      where: { valueId: parseInt(valueId) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting value:", error);
    res.status(500).json({ message: "Error deleting value" });
  }
};
