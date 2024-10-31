import { Request, Response } from "express";
import { sendMessageToKafka } from "../kafka/producer";

export const createOrder = async (req: Request, res: Response) => {
  const { email, item } = req.body;

  const order = { email, item };

  try {
    sendMessageToKafka("order-confirmation", order);
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
