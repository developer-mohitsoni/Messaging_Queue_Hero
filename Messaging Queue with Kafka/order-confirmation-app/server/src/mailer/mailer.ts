import nodemailer from "nodemailer";
import { config } from "../config/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

export const sendOrderConfirmationEmail = async (
  email: string,
  item: string
) => {
  const mailOptions = {
    from: config.emailUser,
    to: email,
    subject: "Order Confirmation",
    text: `Your order for ${item} has been successfully placed. Please check your email for further details.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error(`Error in sending email: ${error}`);
  }
};
