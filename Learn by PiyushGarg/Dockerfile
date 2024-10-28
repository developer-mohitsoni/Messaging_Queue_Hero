# Use a Node.js base image
FROM node:16

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose any necessary ports (optional for Node.js itself)
EXPOSE 3000

# Define the default command (commented out here as we run both scripts in docker-compose)
# CMD ["node", "producer.js"]
