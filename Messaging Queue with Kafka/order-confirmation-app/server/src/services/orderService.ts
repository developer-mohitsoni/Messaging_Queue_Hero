import prisma from "../models/prisma";

export const processOrderMessage = async (orderData: {
  email: string;
  item: string;
}) => {
  try {
    const newOrder = await prisma.order.create({
      data: {
        email: orderData.email,
        item: orderData.item,
      },
    });
    console.log(`New order created: ${newOrder.id}`);

    // Send an email notification to the customer
  } catch (error) {
    console.error("Error creating new order:", error);
  }
};
