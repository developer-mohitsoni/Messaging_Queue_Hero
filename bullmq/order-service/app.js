import express from "express";
import { Queue, QueueEvents } from "bullmq";

const app = express();
const port = 5000;

app.use(express.json());

//Queue

const verifyUser = new Queue("user-verification-queue");

const verificationQueueEvents = new QueueEvents("user-verification-queue");

const mailQueue = new Queue("mail-queue");
const checkUserVerification = (jobId) => {
  return new Promise((resolve, reject) => {
    verificationQueueEvents.once(
      "completed",
      ({ jobId: completedJobId, returnvalue }) => {
        if (jobId === completedJobId) {
          // console.log(returnvalue);
          resolve(returnvalue.user);
        }
      }
    );
    verificationQueueEvents.once(
      "failed",
      ({ jobId: failedJobId, failedReason }) => {
        if (jobId === failedJobId) {
          reject(new Error(failedReason));
        }
      }
    );
  });
};

app.post("/order", async (req, res) => {
  try {
    const { orderId, productName, price, userId } = req.body;

    const job = await verifyUser.add("Verify User", {
      userId,
    });

    let isValidUser = await checkUserVerification(job.id);

    // console.log(isValidUser);

    if (!isValidUser) {
      return res.json({
        message: "User verification failed.",
      });
    }

    // save order to database

    const mailJob = await mailQueue.add("Send Mail", {
      from: "apniCompany@company.com",
      to: isValidUser.email,
      subject: "Thank you for your order",
      body: `Success placing of orders.`,
    });

    return res.send({
      message: "User is valid.",
      mailJob: mailJob.id,
    });
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(port, () => {
  console.log(`Order Service is running on port ${port}`);
});
