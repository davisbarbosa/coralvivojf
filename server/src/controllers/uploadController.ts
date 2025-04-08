import { Request, Response } from "express";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { RequestHandler } from "express";
import dotenv from 'dotenv';
import multer from "multer";
dotenv.config();


const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const uploadFile: RequestHandler = async (
  req: Request & { file?: Express.Multer.File },
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const file = req.file;
    const key = `${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    
    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: fileUrl
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: "Error uploading file" });
  }
};

export const deleteFile: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { key } = req.params;

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    
    res.status(200).json({
      message: "File deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: "Error deleting file" });
  }
};
