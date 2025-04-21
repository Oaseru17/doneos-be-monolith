FROM node:22.12.0 as build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY tsconfig.json .
COPY src src

RUN npm run build

# Now build a super small deployment image!
FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/package*.json /app/tsconfig.json .
RUN npm install --omit=dev

COPY .sequelizerc .env.example .

RUN mkdir -p /app/src/config

COPY --from=build /app/dist dist

CMD ["npm", "run", "prod-run"]
