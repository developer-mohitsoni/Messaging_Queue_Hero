import express from "express";
import { Worker } from "bullmq";

const app = express();
const port = 5002;

app.use(express.json());

const sendMail = async (from, to, subject, body) => {
  console.log(`Mail was sent on ${to}`);
};

const mailWorker = new Worker(
  "mail-queue",
  async (job) => {
    // console.log(`Job with jobId: ${job.id}`);

    const { from, to, subject, body } = job.data;
    const sendMailToUser = await sendMail(from, to, subject, body);
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

app.listen(port, () => {
  console.log(`Mailer Service is running on port ${port}`);
});
