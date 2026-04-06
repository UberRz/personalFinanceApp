# -------- BUILD --------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

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
