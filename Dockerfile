# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package.json
COPY package*.json ./

# Install root dependencies
RUN npm install

# Copy client and install dependencies
COPY client ./client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Final stage
FROM node:18-alpine

WORKDIR /app

# Copy root package.json and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy server
COPY server ./server

# Copy built client from builder stage
COPY --from=builder /app/client/build ./client/build

EXPOSE 10000

# Set environment
ENV PORT=10000
ENV NODE_ENV=production

# Start server
CMD ["node", "server/index.js"]
