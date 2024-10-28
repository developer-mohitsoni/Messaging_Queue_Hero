import { Queue } from "bullmq";

import "dotenv/config";

const notificationQueue = new Queue("email-queue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
});

const addToQueue = async () => {
  const result = await notificationQueue.add("email to mohit", {
    email: "mohit@example.com",
    subject: "Hello Mohit",
    body: "Hey Mohit, What's up Or kya ho raha hai",
  });

  console.log("Job added to queue", result.id);
};

addToQueue();
