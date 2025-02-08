import express from "express";
import { Queue } from "bullmq";

const app = express();
const port = 5000;

app.use(express.json());

//Queue

const verifyUser = new Queue("user-verification-queue");

app.post("/order", async (req, res) => {
  const { orderId, productName, price, userId } = req.body;

  const job = await verifyUser.add("Verify User", {
    userId,
  });

  res.send({ jobId: job.id });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
