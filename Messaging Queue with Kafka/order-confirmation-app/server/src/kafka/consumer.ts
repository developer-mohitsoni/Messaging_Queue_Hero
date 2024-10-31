import { KafkaClient, Consumer } from "kafka-node";
import { config } from "../config/config";
import { processOrderMessage } from "../services/orderService";

const kafkaClient = new KafkaClient({
  kafkaHost: config.kafkaHost,
});

const consumer = new Consumer(
  kafkaClient,
  [
    {
      topic: config.kafkaTopic as string,
      partition: 0 as number,
    },
  ],
  { autoCommit: true }
);

consumer.on("message", (message) => {
  const orderData = JSON.parse(message.value.toString());
  processOrderMessage(orderData);
});
