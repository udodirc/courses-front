FROM node:20 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем всё остальное
COPY . .

# Указываем порт
EXPOSE 5173

# Запускаем dev-сервер
CMD ["npm", "run", "dev", "--", "--host"]