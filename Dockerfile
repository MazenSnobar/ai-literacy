# ---------------------
# Stage 1: BUILD STAGE 
# ---------------------
    FROM node:22-alpine AS builder

    # Install essential dependencies (openssl, dumb-init)
    RUN apk update && apk add --no-cache openssl dumb-init
    
    # Set working directory for building
    WORKDIR /app
    
    # Copy package files and install dependencies
    COPY package.json package-lock.json ./
    RUN npm install
    
    # Copy Prisma schema and generate client
    COPY prisma ./prisma
    RUN npx prisma generate
    
    # Copy entire project and build application
    COPY . .
    RUN npm run build
    
    # --------------------------
    # Stage 2: PRODUCTION STAGE
    # --------------------------
    FROM node:22-alpine AS production
    
    # Install essential runtime dependency (openssl required by Prisma)
    RUN apk update && apk add --no-cache openssl dumb-init
    
    # Set working directory for the app
    WORKDIR /app
    
    # Copy only what's necessary from the build stage
    COPY --from=builder /app/build ./build
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    
    # Expose Remix app port
    EXPOSE 3000
    
    # Run the app using dumb-init (prevents zombie processes, recommended)
    CMD ["dumb-init", "npm", "start"]
    