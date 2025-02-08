import express from "express";
import { Worker } from "bullmq";

const app = express();
const port = 5001;

app.use(express.json());

//Worker

const userDB = [
  {
    id: 1,
    name: "Mohit Soni",
    password: "2255",
  },
];

const verificationWorker = new Worker(
  "user-verification-queue",
  (job) => {
    const userId = job.data.userId;

    const user = userDB.find((user) => user.id === userId);

    // console.log(user);

    // Verification logic here
    console.log("User verified");

    return { user };
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

app.listen(port, () => {
  console.log(`User Service is running on port ${port}`);
});
