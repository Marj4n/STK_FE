# 🥢 Menu Management Frontend (Next.js + TypeScript + Tailwind CSS)

A frontend for the **Menu Management App**, connected to a **NestJS + Prisma + MySQL** backend.

---

## ⚙️ Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

Copy `.env.example` and configure it according to your backend API:

```bash
cp .env.example .env
```

Example `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

> Make sure the URL points to your backend server.

---

## 🚀 Run the app

### Development mode

```bash
npm run dev
# atau
yarn dev
```

The frontend will run at `http://localhost:3001` (or another port if configured).

### Production mode

```bash
npm run build
npm start
# atau
yarn build
yarn start
```

### Lint & format

```bash
npm run lint
npm run format
# atau
yarn lint
yarn format
```

---

## 🧩 Tech Stack

- **Next.js** — React framework for building modern web apps
- **TypeScript** — Static type checking
- **Tailwind CSS** — Utility-first CSS styling
- **Zustand** — Lightweight state management for menu and UI
- **Dnd-kit** — Drag & drop library for reordering menus
- **Axios** — HTTP client for backend communication

---

## 📝 Features

- Display menus with nested parent–child structure
- Drag & drop menu reordering (supports unlimited nesting)
- Create / Edit / Delete menu items
- Search menus by name
- Persist open/close state for each menu node
- Fully responsive layout

---

## 🔗 API Integration

- GET `/menus` — Fetch all menus
- POST `/menus` — Create a new menu
- PUT `/menus/:id` — Update a menu
- DELETE `/menus/:id` — Delete a menu
- PATCH `/menus/:id/reorder` — Reorder a menu
- PATCH `/menus/:id/move` — Move a menu to another parent

---

## 💡 Notes

- Make sure the NestJS + Prisma backend is running on the correct port.

---

### **1️⃣ Frontend Dockerfile (`frontend/Dockerfile`)**

```dockerfile
# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose dev port
EXPOSE 3001

# Start frontend in dev mode
CMD ["npm", "run", "dev"]
```

> For production, replace `CMD` with:
>
> ```dockerfile
> RUN npm run build
> CMD ["npm", "start"]
> ```

---

### **2️⃣ Docker Compose (`docker-compose.yml`)**

```yaml
version: "3.9"

services:
  mysql:
    image: mysql:8.0
    container_name: menu-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: menu_db
      MYSQL_USER: admin
      MYSQL_PASSWORD: admin123
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: menu-backend
    ports:
      - "3000:3000"
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      DATABASE_URL: "mysql://admin:admin123@mysql:3306/menu_db"
    volumes:
      - ./backend/src:/app/src
      - ./backend/prisma:/app/prisma
      - /app/node_modules
    command: npm run start:dev

  frontend:
    build: ./frontend
    container_name: menu-frontend
    ports:
      - "3001:3001"
    environment:
      NEXT_PUBLIC_API_URL: "http://backend:3000/api"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    command: npm run dev

volumes:
  mysql-data:
```

---

### **3️⃣ Notes**

1. In development, **frontend** communicates with backend via Docker service name: `http://backend:3000/api`.
2. Avoid mounting `dist` or `node_modules` from host to container to prevent lock/busy errors.
3. Run all services together:

```bash
docker-compose up --build
```

Frontend → `http://localhost:3001`
Backend → `http://localhost:3000`
