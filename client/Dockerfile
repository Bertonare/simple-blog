FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Accept build arguments for Next.js public environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_UPLOAD_URL

# Make them available during the build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_UPLOAD_URL=$NEXT_PUBLIC_UPLOAD_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
