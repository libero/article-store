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
# Stage: Production environment
#
FROM node AS prod
ENV NODE_ENV=production

COPY --from=npm-prod /app/ .

CMD ["sleep", "86400"]

HEALTHCHECK --interval=5s --timeout=1s \
    CMD node --version



#
# Stage: Development NPM install
#
FROM npm-prod AS npm-dev

RUN npm install



#
# Stage: Development environment
#
FROM prod AS dev
ENV NODE_ENV=development

COPY --from=npm-dev /app/ .
