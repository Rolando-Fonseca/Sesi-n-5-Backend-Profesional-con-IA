# Usamos una imagen de Node estable
FROM node:18-alpine

# Creamos la carpeta de la app
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Generamos el cliente de Prisma y construimos el proyecto
RUN npx prisma generate
RUN npm run build

# Exponemos el puerto
EXPOSE 3000

# Comando para arrancar
CMD ["npm", "run", "start:prod"]