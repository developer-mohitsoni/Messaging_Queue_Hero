import { Queue, QueueEvents } from "bullmq";
import express from "express";
import { defaultQueueConfig } from "./config/queueConfig";

const app = express();
const port = 5000;

app.use(express.json());

// Queue
const verifyUser = new Queue("user-verification-queue", defaultQueueConfig);
const verificationQueueEvents = new QueueEvents("user-verification-queue");
const mailQueue = new Queue("mail-queue");

const checkUserVerification = async (jobId) => {
	return new Promise((resolve, reject) => {
		// We still need a Promise here because we're working with events
		const waitingHandler = ({ jobId: waitingJobId }) => {
			console.log(`A job with ID ${waitingJobId} is waiting`);
		};

		const completedHandler = async ({ jobId: completedJobId, returnvalue }) => {
			if (jobId === completedJobId) {
				// Clean up event listeners to prevent memory leaks
				verificationQueueEvents.off("waiting", waitingHandler);
				verificationQueueEvents.off("completed", completedHandler);
				verificationQueueEvents.off("failed", failedHandler);
				resolve(returnvalue.user);

				await verifyUser.removeJob(completedJobId);
				console.log(`Job with ID ${completedJobId} completed successfully`);
			}
		};

		const failedHandler = async ({ jobId: failedJobId, failedReason }) => {
			if (jobId === failedJobId) {
				// Clean up event listeners to prevent memory leaks
				verificationQueueEvents.off("waiting", waitingHandler);
				verificationQueueEvents.off("completed", completedHandler);
				verificationQueueEvents.off("failed", failedHandler);
				reject(new Error(failedReason));
			}
		};

		const stalledHandler = async ({ jobId: stalledJobId }) => {
			if (jobId === stalledJobId) {
				// Clean up event listeners to prevent memory leaks
				verificationQueueEvents.off("waiting", waitingHandler);
				verificationQueueEvents.off("completed", completedHandler);
				verificationQueueEvents.off("failed", failedHandler);
				reject(new Error("Job stalled"));
			}
		};

		verificationQueueEvents.on("waiting", waitingHandler);
		verificationQueueEvents.on("completed", completedHandler);
		verificationQueueEvents.on("failed", failedHandler);
		verificationQueueEvents.on("stalled", stalledHandler);
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
			})),
		);

		console.log(jobs);

		// Already using await here, which is good
		const validUsers = await Promise.all(
			jobs.map((job) => checkUserVerification(job.id)),
		);

		console.log(validUsers);

		if (!validUsers || validUsers.length === 0) {
			return res.json({
				message: "User verification failed.",
			});
		}

		// save order to database

		const mailJobs = await mailQueue.addBulk(
			validUsers.map((user) => ({
				name: "Send Mail",
				data: {
					from: "apniCompany@company.com",
					to: user.email,
					subject: "Thank you for your order",
					body: "Success placing of orders.",
				},
			})),
		);

		return res.send(
			mailJobs.map((job) => ({
				message: "Mail sent successfully",
				jobId: job.id,
			})),
		);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ error: err.message });
	}
});

app.listen(port, () => {
	console.log(`Order Service is running on port ${port}`);
});
