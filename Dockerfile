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
    tsconfig.json \
    ./
COPY --from=npm-dev /app/ .
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
ENV NODE_ENV=production

COPY --from=npm-prod /app/ .
COPY --from=build-prod /app/build/ build/

CMD ["npm", "run", "start"]
