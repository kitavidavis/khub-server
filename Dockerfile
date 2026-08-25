# Step 1: Use a lightweight Node.js image
FROM node:18-alpine

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies and PM2 globally
RUN npm install --production && npm install pm2 -g

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Expose the application port
EXPOSE 4000

# Step 7: Start the application using PM2
CMD ["pm2-runtime", "ecosystem.config.js"]
