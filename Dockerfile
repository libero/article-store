FROM node:12.13.0-alpine AS node
WORKDIR /app



#
# Stage: Production NPM install
#
FROM node AS npm-prod

COPY package.json \
    package-lock.json \
    ./

RUN npm install --production



#
# Stage: Development NPM install
#
FROM npm-prod AS npm-dev

RUN npm install



#
# Stage: Base environment
#
FROM node AS base

COPY LICENSE.md .

HEALTHCHECK --interval=5s --timeout=1s \
    CMD node --version



#
# Stage: Development environment
#
FROM base AS dev
ENV NODE_ENV=development

COPY --from=npm-dev /app/ .

CMD ["sleep", "86400"]



#
# Stage: Production environment
#
FROM base AS prod
ENV NODE_ENV=production

COPY --from=npm-prod /app/ .

CMD ["sleep", "86400"]
