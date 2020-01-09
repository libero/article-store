FROM node:12.14.0-alpine AS node
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
EXPOSE 8080

COPY LICENSE.md .

HEALTHCHECK --interval=5s --timeout=1s \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1



#
# Stage: Development environment
#
FROM base AS dev
ENV NODE_ENV=development

COPY .eslintignore \
    .eslintrc.js \
    jest.config.js \
    stryker.conf.js \
    tsconfig.json \
    ./
COPY --from=npm-dev /app/ .
COPY test/ test/
COPY src/ src/

CMD ["npm", "run", "start:dev"]



#
# Stage: Production build
#
FROM dev AS build-prod
ENV NODE_ENV=production

RUN npm run build



#
# Stage: Production environment
#
FROM base AS prod
ARG image_tag
ENV NODE_ENV=production

COPY --from=npm-prod /app/ .
COPY --from=build-prod /app/build/ build/

USER node

LABEL org.opencontainers.image.revision=${image_tag} \
    org.opencontainers.image.source=https://github.com/libero/article-store

# npm acts as PID 1, handling signals to stop the application immediately
CMD ["npm", "run", "start"]
