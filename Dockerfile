FROM node:18-alpine
WORKDIR /app
COPY package.json ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN npm install
RUN cd backend && npm install
RUN cd frontend && npm install
COPY . .
RUN cd frontend && npm run build
RUN cp -r frontend/dist backend/public
WORKDIR /app/backend
EXPOSE 3001
CMD ["npm", "run", "start", "--", "-p", "3001"]