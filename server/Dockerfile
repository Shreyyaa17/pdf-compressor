# Use official Node.js long-term support image on Alpine Linux (lightweight & secure)
FROM node:20-alpine

# Install Ghostscript on Alpine Linux ecosystem
RUN apk add --no-cache ghostscript

# Set working directory inside the container
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies in production mode
RUN npm ci

# Copy the rest of the backend source code
COPY . .

# Compile TypeScript to JavaScript in the /dist folder
RUN npm run build

# Create required temporary directories inside the container
RUN mkdir -p tmp_uploads tmp_outputs

# Expose the backend port
EXPOSE 5000

# Start the compiled production server
CMD ["npm", "start"]