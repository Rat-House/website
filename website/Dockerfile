FROM node:18-alpine as builder
WORKDIR /build

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm run lint
RUN npm run check
RUN npm run build

##################

FROM node:18-alpine
WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY --from=builder /build/build ./app
COPY --from=builder /build/static ./static

ENV PORT=5173

EXPOSE 5173
CMD ["node", "app"]
