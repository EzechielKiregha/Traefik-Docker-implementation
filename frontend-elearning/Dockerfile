# Base image
FROM node:20-alpine AS builder

# Set build-time environment variable
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL:-/}

# Set working directory
WORKDIR /opt/web

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:latest

# Copy Nginx configuration template
COPY nginx.conf /etc/nginx/default.conf

# Copy built assets from builder stage
# COPY --from=builder /opt/web /usr/share/nginx/html
COPY --from=builder /opt/web/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Default command will use envsubst to process the nginx template
CMD ["nginx", "-g", "daemon off;"]