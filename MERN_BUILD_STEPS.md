# Udaan World School MERN Website Build Guide

This project now has:

- A React/Vite frontend at the project root
- Internal routes for all major Udaan school pages
- Udaan logo, leadership photos, documents, teacher list, fee table, and disclosure downloads
- A backend starter in `server/`
- Admin login/dashboard frontend shells

Use this guide in VS Code to continue the complete MERN build.

## 0. Open In VS Code

1. Open VS Code.
2. Click `File > Open Folder`.
3. Select:

```txt
/Users/ankitpandey/Documents/Codex/2026-04-20-main-id-main-class-site-main
```

4. Open the VS Code terminal with:

```txt
Terminal > New Terminal
```

You will usually run two terminals:

- Terminal 1: frontend
- Terminal 2: backend

## 1. Final Stack

- Frontend: React + Vite + React Router + lucide-react
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- Admin auth: JWT + bcrypt
- Uploads: Cloudinary or local uploads during development
- Forms: Admission enquiry, contact enquiry, career application
- Deployment: Vercel or Netlify for frontend, Render or Railway for backend, MongoDB Atlas for database

## 2. Recommended Folder Structure

```txt
project-root/
  public/
    documents/
      admission-form.docx
      affiliation-letter.pdf
      recognition-certificate.pdf
      trust-certificate.pdf
      teacher-list.xlsx
    images/
      people/
        director.jpeg
        principal.jpeg
        founder.jpeg
    udaan-world-logo.jpeg
  src/
    components/
    data/
    pages/
    pages/admin/
    services/
    App.jsx
    main.jsx
    styles.css
  server/
    src/
      config/
        db.js
        cloudinary.js
      controllers/
        authController.js
        enquiryController.js
        blogController.js
        galleryController.js
        pageController.js
      middleware/
        authMiddleware.js
        uploadMiddleware.js
      models/
        Admin.js
        Enquiry.js
        Blog.js
        GalleryItem.js
        PageContent.js
      routes/
        authRoutes.js
        enquiryRoutes.js
        blogRoutes.js
        galleryRoutes.js
        pageRoutes.js
      app.js
      server.js
    .env
    package.json
```

## 3. Installation Commands

Frontend is already installed. If you clone this later, run:

```bash
npm install
```

To start frontend:

```bash
npm run dev
```

Backend dependencies still need to be installed inside `server`:

```bash
cd server
npm install express mongoose cors dotenv bcryptjs jsonwebtoken multer cloudinary
npm install -D nodemon
```

Then create `server/.env` by copying `server/.env.example`.

## 4. Backend Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=make_this_long_and_private
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

## 5. Backend Core Files

These files already exist in this project. Read them in VS Code:

- `server/src/server.js`
- `server/src/app.js`
- `server/src/config/db.js`
- `server/src/models/Admin.js`
- `server/src/models/Enquiry.js`
- `server/src/models/Content.js`
- `server/src/routes/authRoutes.js`
- `server/src/routes/enquiryRoutes.js`
- `server/src/routes/contentRoutes.js`

Main backend entry file:

```js
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

`server/src/app.js`

```js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/pages", pageRoutes);

app.get("/", (req, res) => res.send("Udaan World School API running"));

export default app;
```

`server/src/config/db.js`

```js
import mongoose from "mongoose";

export default async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
}
```

## 6. Required Database Models

You should create these models:

- `Admin`: name, email, password, role
- `Enquiry`: studentName, parentName, phone, email, className, message, status
- `Blog`: title, slug, excerpt, content, coverImage, published
- `GalleryItem`: title, type, imageUrl, videoUrl, category
- `PageContent`: pageKey, title, sections array
- `CareerApplication`: name, email, phone, resumeUrl, message

## 7. Admin Panel Features

The frontend currently has:

```txt
/admin/login
/admin/dashboard
/admin-guide
```

Minimum admin panel to complete:

- Login/logout
- Dashboard stats
- View admission enquiries
- View contact messages
- Add/edit/delete blogs
- Add/edit/delete gallery photos and videos
- Update page content sections
- Upload images
- Toggle publish/unpublish

Recommended admin routes:

```txt
/admin/login
/admin/dashboard
/admin/enquiries
/admin/blogs
/admin/gallery
/admin/pages
/admin/settings
```

## 8. Frontend Pages To Create

The public routes are already created in `src/App.jsx`:

- Home
- About Us
- Founders
- Chairman's Message
- Principal's Desk
- Senior Leader Team
- Day School
- Residential
- Knowledge Partners
- Admission Procedure
- Fee Structure
- Admission Enquiry
- Academics / Results
- Academic Facilities
- Sports Facilities
- Scholarships
- Photo Gallery
- Video Gallery
- Careers
- Blogs
- Contact Us
- Mandatory Public Disclosure
- Terms of Services
- Privacy Policy

Continue improving the page content in:

```txt
src/pages/pageContent.js
src/data/siteData.js
src/pages/
```

## 9. Frontend Routing

Install:

```bash
npm install react-router-dom axios
```

Create `src/routes/AppRoutes.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import About from "../pages/About.jsx";
import Contact from "../pages/Contact.jsx";
import AdminLogin from "../pages/admin/AdminLogin.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 10. API Service File

Create `client/src/services/api.js`:

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

## 11. Deployment Steps

### MongoDB Atlas

1. Create a MongoDB Atlas account.
2. Create a free cluster.
3. Create a database user.
4. Allow network access.
5. Copy connection string into `MONGO_URI`.

### Backend On Render

1. Push project to GitHub.
2. Create a Render Web Service.
3. Root directory: `server`.
4. Build command: `npm install`.
5. Start command: `npm start`.
6. Add `.env` values in Render dashboard.

### Frontend On Vercel

1. Import GitHub project.
2. Root directory: `client`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add `VITE_API_URL=https://your-backend-url.onrender.com/api`.

## 12. Development Order

1. Keep frontend running with `npm run dev`.
2. Install backend dependencies in `server`.
3. Create MongoDB Atlas database.
4. Fill `server/.env`.
5. Run backend with `cd server` then `npm run dev`.
6. Seed first admin with `npm run seed:admin`.
7. Open `/admin/login`.
8. Connect admission/contact forms to `/api/enquiries`.
9. Build admin enquiry list page.
10. Build admin blogs CRUD.
11. Build admin gallery CRUD.
12. Build admin page-content editor.
13. Test full flow locally.
14. Deploy backend.
15. Deploy frontend.
16. Connect real domain.

## 13. Local Run Commands

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev
```

Full development normally runs two terminals:

```bash
cd client
npm run dev
```

```bash
cd server
npm run dev
```
