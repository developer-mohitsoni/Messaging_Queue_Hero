import { Worker } from "bullmq";

import "dotenv/config";

const redisConnection = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
};

const sendEmail = () => {
  return new Promise((res, rej) => {
    setTimeout(() => res(), 5 * 1000);
  });
};

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log(`Message received at id: ${job.id}`);

    console.log("Processing message");

    console.log(`Sending email to ${job.data.email}`);

    await sendEmail();

    console.log("Email Sent");
  },
  { connection: redisConnection }
);

console.log("Worker is now listening for jobs in the email-queue.");
