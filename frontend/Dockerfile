# -------- BUILD --------
FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_URL=http://localhost:8080

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create .env file with VITE_API_URL so Vite can inject it during build
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env

# Build the application
RUN npm run build

# -------- RUNTIME --------
FROM node:20-alpine

WORKDIR /app

# Install serve to run the app
RUN npm install -g serve

# Copy built app from build stage
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
