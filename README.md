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