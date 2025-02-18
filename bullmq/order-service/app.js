import express from "express";
import { Queue, QueueEvents } from "bullmq";

const app = express();
const port = 5000;

app.use(express.json());

//Queue

const verifyUser = new Queue("user-verification-queue", {
  defaultJobOptions: {
    removeOnComplete: {
      // Retain jobs for 10 sec or max 1000 jobs
      age: 10,
      count: 1000,
    },
    removeOnFail: {
      // Retain failed jobs for 24 hours or max 5000 jobs
      removeOnFail: {
        age: 3600,
        count: 5000,
      },
    },
  },
});

const verificationQueueEvents = new QueueEvents("user-verification-queue");

const mailQueue = new Queue("mail-queue");
const checkUserVerification = (jobId) => {
  return new Promise((resolve, reject) => {
    verificationQueueEvents.on("waiting", ({ jobId }) => {
      console.log(`A job with ID ${jobId} is waiting`);
    });
    verificationQueueEvents.on(
      "completed",
      ({ jobId: completedJobId, returnvalue }) => {
        if (jobId === completedJobId) {
          // console.log(returnvalue);
          resolve(returnvalue.user);
        }
      }
    );
    verificationQueueEvents.on(
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
    const users = req.body;
    console.log(users);

    // 🟢 Bulk job insert
    const jobs = await verifyUser.addBulk(
      users.map((user) => ({
        name: "Verify User",
        data: user,
      }))
    );

    console.log(jobs);

    let isValidUser = await Promise.all(
      jobs.map((job) => checkUserVerification(job.id))
    );

    console.log(isValidUser);

    if (!isValidUser) {
      return res.json({
        message: "User verification failed.",
      });
    }

    // save order to database

    const mailJob = await mailQueue.addBulk(
      isValidUser.map((user) => ({
        name: "Send Mail",
        data: {
          from: "apniCompany@company.com",
          to: user.email,
          subject: "Thank you for your order",
          body: `Success placing of orders.`,
        },
      }))
    );

    return res.send(
      mailJob.map((job) => ({
        message: "Mail sent successfully",
        jobId: job.id,
      }))
    );
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(port, () => {
  console.log(`Order Service is running on port ${port}`);
});
