FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Copy the rest of the project
COPY . .

# Build the Vite application
RUN npm install

# Expose the port on which the container listens
#EXPOSE 5174

# Start the container with the command "yarn dev" to run the development server
CMD ["npm", "run", "dev"]