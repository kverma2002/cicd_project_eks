# Build Stage: Build the client app using Vite
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy all source files (including your Express server code and client code)
COPY . .

# Build the production bundle (this creates the 'dist' folder)
RUN npm run build

# Production Stage: Package the Express server with the built client assets
FROM node:18-alpine

WORKDIR /app

# Copy the built static assets from the build stage
COPY --from=build /app/dist ./dist

# Copy the Express server code (e.g., server.js) and any related files
COPY --from=build /app/server.js ./
# If your server code spans multiple files or directories, copy those as well.
# For example:
# COPY --from=build /app/server ./server

# Copy package.json so we can install production dependencies
COPY --from=build /app/package.json ./

# Install only production dependencies
RUN npm install --production

# Expose the port that your Express server listens on (e.g., 3000)
EXPOSE 3000

# Start the Express server
CMD ["node", "server.js"]
