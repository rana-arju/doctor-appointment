import { Request, Response } from "express";
import { adminServices } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.createAdmin(req.body);
    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const adminController = {
  createAdmin,
};
