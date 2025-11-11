# ==== BUILD STAGE ====
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files dan install dependencies
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy seluruh source code
COPY . .

# Inject environment variables dari Railway ke build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build Next.js (Railway akan inject env ke sini)
RUN npm run build

# ==== RUN STAGE ====
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Non-root user untuk keamanan
RUN addgroup --system app && adduser --system -G app app

# Copy hasil build dari builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Default port Next.js
EXPOSE 3000

# Jalankan Next.js
USER app
CMD ["npm", "start"]
