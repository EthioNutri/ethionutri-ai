# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments passed from Docker Compose
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_API_URL

ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build Vite production bundle to dist/
RUN npm run build

# Stage 2: Nginx web server stage
FROM nginx:alpine AS runner

# Copy custom nginx configuration with SPA fallback routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
