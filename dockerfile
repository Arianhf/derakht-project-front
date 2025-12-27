# Stage 1: Build the Next.js application
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

ARG NEXT_PUBLIC_BASE_URL=/api
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}

# Build the application with standalone output
RUN npm run build

# Stage 2: Final container with both Nginx and Node.js
FROM nginx:alpine

# Install Node.js and curl in the Nginx container
RUN apk add --no-cache nodejs npm curl

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create app directory
WORKDIR /app

# Copy the Next.js standalone application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN echo '#!/bin/sh' > /start.sh && \
    echo 'cd /app' >> /start.sh && \
    echo 'PORT=3000 node -e "process.env.HOSTNAME=\"0.0.0.0\"; require(\"./server.js\")" &' >> /start.sh && \
    echo 'sleep 5' >> /start.sh && \
    echo 'nginx -g "daemon off;"' >> /start.sh && \
    chmod +x /start.sh

EXPOSE 80

# Start both Node.js and Nginx
CMD ["/start.sh"]