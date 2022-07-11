FROM node:14.12.0-alpine

WORKDIR /usr/src/backend
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8089
CMD ["npm", "start"]

# Run the following command to see the image:
# docker build -t lims-back-end ./
# docker run -p 8089:8089 -d lims-back-end

#docker ps
