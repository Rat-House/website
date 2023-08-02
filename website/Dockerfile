FROM node:18-buster as builder
WORKDIR /app

# install bun
RUN curl -fsSL https://bun.sh/install | bash

COPY . .
RUN /root/.bun/bin/bun install --frozen-lockfile

# running on install is not working -- bunx
RUN /root/.bun/bin/bun svelte-kit sync

RUN /root/.bun/bin/bun run lint
RUN /root/.bun/bin/bun run check
RUN /root/.bun/bin/bun run build

#######################################

FROM oven/bun:0.7
WORKDIR /app

COPY package.json bun.lockb .
RUN bun install --production

COPY --from=builder /app/build ./src
COPY --from=builder /app/static ./static

ENV PORT=5173

EXPOSE $PORT
CMD ["./src/index.js"]