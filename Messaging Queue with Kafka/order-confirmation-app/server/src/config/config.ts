import "dotenv/config";

const _config = {
  port: process.env.PORT || 8000,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASSWORD,
  kafkaHost: process.env.KAFKA_HOST,
  kafkaTopic: process.env.KAFKA_TOPIC,
};
// Make config readonly that's why use Object.freeze
export const config = Object.freeze(_config);
