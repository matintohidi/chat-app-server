FROM node:20-bullseye

# Set the working directory
WORKDIR /chat-app-server

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port the app runs on
EXPOSE 1338

# Command to run the application
CMD ["npm", "run", "start:prod"]
