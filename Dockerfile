FROM node:21.3.0-alpine

# set working dir
WORKDIR /app

# install deps
COPY package.json package-lock.json* ./
RUN npm ci

# copy source
COPY . .

# expose Vite default port and set host to 0.0.0.0
EXPOSE 5173

# run dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]