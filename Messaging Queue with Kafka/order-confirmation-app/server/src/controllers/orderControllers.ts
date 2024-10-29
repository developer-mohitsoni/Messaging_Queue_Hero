import { Request, Response } from "express";

export const createOrder = async (req: Request, res: Response) => {
  const { email, item } = req.body;

  const order = { email, item };

  try {
    // Simulate a database write operation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while placing the order",
    });
  }
};
