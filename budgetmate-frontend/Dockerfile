# 1. A VITE_API_BASE build arguméntként érkezik
ARG VITE_API_BASE

FROM node:20

WORKDIR /app
COPY . .

# 2. Build argumént beállítása
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE

RUN npm install
RUN npm run build

# 3. Fejlesztéshez (dev szerverrel)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
