import { KafkaClient, Producer } from "kafka-node";
import { config } from "../config/config";

const kafkaClient = new KafkaClient({ kafkaHost: config.kafkaHost });
const producer = new Producer(kafkaClient);

export const sendMessageToKafka = (topic: string, message: any) => {
  const payloads = [{ topic, messages: JSON.stringify(message) }];
  
  producer.send(payloads, (error, data) => {
    if (error) console.log("Kafka Error:", error);
    else console.log("Message sent to Kafka:", data);
  });
};
