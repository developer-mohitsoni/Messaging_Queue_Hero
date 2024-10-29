import express from "express";
import { createOrder } from "../controllers/orderControllers";

const router = express.Router();

router.post("/orders", createOrder);

export default router;
