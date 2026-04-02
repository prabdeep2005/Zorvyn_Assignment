FROM oven/bun:1.2.16-alpine AS base
WORKDIR /usr/src/app

# [DEVELOPMENT] Base image with all dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Final Runtime image (optimized for production)
FROM base AS release
COPY . .
# ENV NODE_ENV=production
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
