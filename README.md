# Rathouse website
full website

## development
for testing
```bash
docker compose -p rathouse up -d caddy pocketbase
docker run -it -v ./website/:/home/app/ --network rathouse_default --name website --rm -w /home/app node:18-alpine /bin/sh -c "npm i && npm run dev -- --host"
```
if the above doesnt work and you are on windows replace `./website/` with `.\website\`

run for deployment and updating
```bash
docker compose up -d
```