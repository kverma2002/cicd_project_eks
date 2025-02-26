# Build stage
FROM node:18-alpine AS build

# Set working directory.
WORKDIR /app

# Copy package files and install dependencies.
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application code.
COPY . .

# Build the production bundle.
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from the build stage to Nginx's html folder.
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80.
EXPOSE 80

# Run Nginx in the foreground.
CMD ["nginx", "-g", "daemon off;"]
