import express, { Application, Request, Response } from "express";
import { config } from "./config/config";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
