# Our first stage, that is the Builder
FROM node:8-alpine AS ts-sample-builder
WORKDIR /app
COPY . .
RUN rm -rf dist
RUN npm install
RUN npm run build:ts

# Our Second stage, that creates an image for production
FROM node:8-alpine AS ts-sample-prod
VOLUME /app
WORKDIR /app
COPY --from=ts-sample-builder ./app/dist ./dist
COPY package* ./
RUN npm install --production
CMD npm start