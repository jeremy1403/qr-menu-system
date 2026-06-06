# QR Menu System

A full-stack digital menu system for restaurants. Customers scan a QR code to browse the menu on their phone. Restaurant owners manage everything through a secure admin panel.

**Live Demo:** [https://qr-menu-system-bice.vercel.app](https://qr-menu-system-bice.vercel.app)  
**Admin Panel:** [https://qr-menu-system-bice.vercel.app/admin/login](https://qr-menu-system-bice.vercel.app/admin/login)

> Demo credentials: `admin@restaurant.com` / `Admin1234`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui |
| Backend | NestJS, TypeScript, REST API |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Auth | JWT + Passport.js |
| Image Storage | Cloudinary |
| Deployment | Vercel (frontend), Render (backend) |
---

## The Problem

Traditional printed menus lack food images and descriptions, causing customers to repeatedly order the same dishes and staff to spend time answering menu questions.

## The Solution

A digital QR menu system that gives customers a visually rich, searchable menu on their phones — and gives restaurant owners a real-time management dashboard with no reprinting required.

---

## Features

**Customer Menu**
- Scan QR code to access menu instantly
- Browse by category (Rice, Noodles, Seafood, Beverages, Desserts)
- Search dishes by name or keyword
- View food images, descriptions, ingredients and pricing
- Featured and popular dish highlights
- Mobile-first responsive design

**Admin Panel**
- Secure JWT authentication
- Add, edit and delete menu items and categories
- Upload food images via Cloudinary CDN
- Toggle featured and popular flags
- Manage ingredients
- QR code generator with download and print



---

## Architecture

```
Customer / Admin Browser
        ↓
   Next.js (Vercel)
        ↓
   NestJS REST API (Render)
        ↓
   PostgreSQL (Neon)
        ↓
   Cloudinary (Images)
```

---

## Local Development

### Prerequisites
- Node.js 20+
- npm

### Setup

```bash
# Clone the repo
git clone https://github.com/jeremy1403/qr-menu-system.git
cd qr-menu-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

**backend/.env**
```env
DATABASE_URL=your-neon-connection-string
JWT_SECRET=your-secret
PORT=3001
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
```

**frontend/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Run

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Seed Database

```bash
cd backend
npx prisma db seed
```

Open [http://localhost:3000](http://localhost:3000) to view the customer menu.  
Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel.

---

## Database Schema

```
users
categories ──< menu_items >──< menu_item_ingredients >── ingredients
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/login | Public | Admin login |
| GET | /api/categories | Public | List categories |
| GET | /api/menu-items | Public | List menu items |
| GET | /api/menu-items/featured | Public | Featured items |
| GET | /api/menu-items/popular | Public | Popular items |
| GET | /api/menu-items/search?q= | Public | Search items |
| POST | /api/categories | Protected | Create category |
| PUT | /api/categories/:id | Protected | Update category |
| DELETE | /api/categories/:id | Protected | Delete category |
| POST | /api/menu-items | Protected | Create menu item |
| PUT | /api/menu-items/:id | Protected | Update menu item |
| DELETE | /api/menu-items/:id | Protected | Delete menu item |
| POST | /api/upload/image | Protected | Upload image |

---

## Project Structure

```
qr-menu-system/
├── frontend/                  # Next.js application
│   ├── app/
│   │   ├── menu/              # Customer menu page
│   │   ├── admin/             # Admin panel pages
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                # Shadcn components
│   │   └── menu/              # Menu components
│   ├── lib/
│   │   ├── api.ts             # API functions
│   │   └── types.ts           # TypeScript types
│   └── providers/
│       └── query-provider.tsx
│
└── backend/                   # NestJS application
    ├── src/
    │   ├── auth/              # JWT authentication
    │   ├── categories/        # Categories module
    │   ├── menu-items/        # Menu items module
    │   ├── ingredients/       # Ingredients module
    │   ├── cloudinary/        # Image upload module
    │   ├── prisma/            # Database service
    │   └── users/             # Users module
    └── prisma/
        ├── schema.prisma      # Database schema
        └── seed.ts            # Seed data
```

---

## Author

**Jeremiah** — Full Stack Developer  
Built as a portfolio project demonstrating full-stack development with modern technologies.
