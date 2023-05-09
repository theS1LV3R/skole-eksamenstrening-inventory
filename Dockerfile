FROM node:lts-alpine as builder

# Set the working directory to /app
WORKDIR /app

#Install package json
COPY package.json .
COPY package-lock.json .
COPY prisma .

# Install any needed packages specified in package.json
RUN npm install

# Copy the current directory contents into the container at /app
COPY . /app

# Builds the typescrpit into somthing that can be read
RUN npm run build

FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /app/package.json /app
COPY --from=builder /app/package-lock.json /app
COPY --from=builder /app/prisma /app

RUN npm install --omit=dev

COPY --from=builder /app/dist /app/dist

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the command to start the app
ENTRYPOINT [ "node", "dist/main.js" ]
