# Hotel Menu Platform

A modern MERN-based hotel menu platform with a luxury guest experience and a powerful internal admin dashboard.

Guests can browse the menu from mobile devices (including QR-style access), while admins can manage food, categories, hotel details, and image processing from one control panel.

---

## Highlights

- Guest-facing mobile-first menu with premium UI
- Multi-language support (English, Amharic, Arabic + RTL)
- Offline-friendly behavior (cached menu fallback)
- Admin dashboard for menu/category/hotel management
- New **Food Image Manager** utility for fast image mapping
- LAN-friendly dev setup for testing on phones and tablets

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- React Router

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT auth
- Multer (image uploads)

---

## Project Structure

```text
Hotel_Menu/
  frontend/                # React + Vite app
    src/
      pages/               # Menu, Hotel, Admin pages
      components/          # UI and admin components
      services/api.js      # Axios instance
  backend/                 # Express API
    src/
      controllers/
      routes/
      models/
      middleware/
  uploads/
    temp/                  # Unprocessed images (image manager input)
    menu/                  # Processed menu images (image manager output)
```

---

## Features

## Guest Experience
- Splash -> Menu -> Food modal -> Hotel info flow
- Sticky glass navbar, sticky search, sticky categories
- Skeleton loading states
- Smooth animations and micro-interactions
- Hotel info sections and gallery
- Responsive layout for phones, tablets, kiosks

## Language & Accessibility
- EN / AM / AR language switching
- Automatic RTL for Arabic
- Improved touch targets and readable typography

## Admin Dashboard
- Dashboard analytics
- Menu CRUD
- Category management
- Hotel information management
- **Food Image Manager** (`/admin/image-manager`)

## Food Image Manager
- Reads unprocessed files from `/uploads/temp`
- Shows one image at a time with preview + metadata
- Search/select menu item from MongoDB
- Auto-generates slug filename (e.g. `grilled-chicken.jpg`)
- Renames and moves file to `/uploads/menu`
- Updates `menu.image` field in MongoDB automatically
- Handles duplicates (`name-2.jpg`, `name-3.jpg`, ...)
- Keyboard shortcuts:
  - `Enter` -> Rename & Save
  - `Arrow Right` -> Next
  - `Arrow Left` -> Previous
  - `S` -> Skip

---

## API Overview

Base URL: `/api`

- `GET /api/health`
- `POST /api/login`
- `GET /api/menu`
- `POST /api/menu` (auth)
- `PUT /api/menu/:id` (auth)
- `DELETE /api/menu/:id` (auth)
- `GET /api/categories`
- `POST /api/categories` (auth)
- `DELETE /api/categories/:id` (auth)
- `GET /api/hotel`
- `PUT /api/hotel` (auth)
- `GET /api/dashboard/stats` (auth)
- `GET /api/image-manager/images` (auth)
- `POST /api/image-manager/rename` (auth)

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hotel_menu
JWT_SECRET=replace_with_strong_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=/api
# Optional: set for LAN HMR stability on phones
VITE_HMR_HOST=192.168.0.181
```

---

## Getting Started

## 1) Install Dependencies

```bash
# backend
cd backend
npm install

# frontend
cd ../frontend
npm install
```

## 2) Run Backend

```bash
cd backend
npm run dev
```

## 3) Run Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:5000`

---

## Test on Other Devices (Same Wi-Fi)

1. Start backend and frontend on your computer
2. Open the Vite network URL shown in terminal, for example:
   - `http://192.168.0.181:5173`
3. Ensure firewall allows local network access if needed

The Vite config already includes:
- host binding (`0.0.0.0`)
- API proxy for `/api` and `/uploads`
- HMR options for LAN debugging

---

## Build for Production

```bash
cd frontend
npm run build
npm run preview
```

---

## Troubleshooting

## Menu not loading on phone
- Make sure backend is running on port `5000`
- Confirm frontend uses `VITE_API_URL=/api`
- Verify you opened the network URL (not `localhost`) on phone

## Vite WebSocket / HMR errors
- Restart dev server after `.env` or `vite.config.js` changes
- Set `VITE_HMR_HOST` to your computer's LAN IP if required
- Hard refresh browser

## Admin image rename issues
- Confirm image exists in `/uploads/temp`
- Confirm selected menu item exists
- Ensure admin is logged in (valid token)

---

## Roadmap Ideas

- Drag & drop upload area for temp images
- Zoom/pan controls in image manager
- Bulk auto-mapping suggestions (AI-assisted)
- Role-based admin permissions
- PWA install enhancements

---

## License

Internal project / private usage unless specified otherwise.
