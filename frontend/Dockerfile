# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf
COPY ssl/frontend-cert.pem /etc/nginx/certs/cert.pem
COPY ssl/frontend-key.pem /etc/nginx/certs/key.pem
COPY ssl/ca-cert.pem /etc/nginx/certs/ca.pem

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]

