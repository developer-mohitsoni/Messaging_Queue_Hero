import express, { Application, Request, Response } from "express";
import { config } from "./config/config";
import cors from "cors";

import orderRoutes from "./routes/orderRoutes";

const app = express();

const PORT = config.port;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
