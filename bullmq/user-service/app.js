import { Worker } from "bullmq";
import express from "express";

const app = express();
const port = 5001;

app.use(express.json());

//Worker

const userDB = [
	{
		id: 1,
		name: "Mohit Soni",
		password: "2255",
		email: "mohit@gmail.com",
	},
	{
		id: 2,
		name: "Ayushi Sharma",
		password: "5588",
		email: "ayushi@gmail.com",
	},
	{
		id: 4,
		name: "Priya Sharma",
		password: "8888",
		email: "priya@gmail.com",
	},
];

const verificationWorker = new Worker(
	"user-verification-queue",
	(job) => {
		const userId = job.data.userId;
		console.log(job.data.userId);

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
		limiter: {
			max: 10,
			duration: 1000, // Per second
		},
	},
);

verificationWorker.on("completed", (job) => {
	console.log(`${job.id} has completed!`);
});

verificationWorker.on("failed", (job, err) => {
	console.log(`${job.id} has failed with ${err.message}`);
});

app.listen(port, () => {
	console.log(`User Service is running on port ${port}`);
});
