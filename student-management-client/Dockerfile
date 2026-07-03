# Build Stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package lock and install dependencies
COPY package*.json ./
RUN npm install

# Pass build environment variables so Vite configures relative API calls
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Copy everything else and compile static assets
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
