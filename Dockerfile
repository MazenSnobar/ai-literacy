
# Build Stage

    FROM node:18-alpine AS builder

    # Set working directory
    WORKDIR /app
    
    # Copy package.json and install dependencies
    COPY package.json package-lock.json ./
    RUN npm install
    
    # Copy the entire project
    COPY . .
    
    # Build the application
    RUN npm run build
    

    # Production Stage
    
    FROM node:18-alpine
    
    # Set working directory
    WORKDIR /app
    
    # Copy only necessary files from the builder stage
    COPY --from=builder /app/build ./build
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/node_modules ./node_modules
    
    # Expose the default Remix port
    EXPOSE 3000
    
    # Start the Remix server
    CMD ["npm", "start"]
    