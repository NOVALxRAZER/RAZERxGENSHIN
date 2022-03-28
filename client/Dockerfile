# Version
FROM node:14.18.3-slim

# Create Main File Directory
WORKDIR /client

# Copy and Install Index Dependecies
# Dari File pakage.json
COPY package.json /client/

# Jalankan / Run NPM Install Setelah COPY Dependencies
RUN npm install

# COPY Semua To Index Again
COPY . /client/

# Build For Client Side Production
# RUN npm run buid

# Expose Port
EXPOSE 3001

# Run Command
CMD ["npm", "start"]