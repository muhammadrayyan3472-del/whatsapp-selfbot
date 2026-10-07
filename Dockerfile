FROM node:20-slim

# Install Chromium and required fonts/libraries for Puppeteer
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       chromium \
       fonts-freefont-ttf \
       ca-certificates \
       wget \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

CMD ["npm", "start"]
