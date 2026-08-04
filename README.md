# Production Role-Based E-Commerce Platform (MERN Stack)

A complete, production-ready, full-stack Role-Based E-Commerce Platform built according to modern enterprise MERN standards.

---

## 🌟 Tech Stack

### Frontend
- **React.js + Vite**: High-performance Single Page Application architecture
- **Tailwind CSS (v4)**: Modern glassmorphism UI, gradient accents, responsive cards & tables
- **React Router DOM**: Client-side routing with role-based route protection
- **Redux Toolkit & React-Redux**: Centralized state management for Auth, Cart, Wishlist, Products, Orders & Users
- **React Hook Form**: Clean form validation
- **React Hot Toast**: Real-time toast feedback notifications
- **Lucide React**: Modern icon set

### Backend
- **Node.js & Express.js**: Modular RESTful APIs with controller/service layer pattern
- **MongoDB & Mongoose**: Object Data Modeling (ODM) with indexed schema constraints
- **JWT & bcryptjs**: Password hashing and secure token-based authentication headers
- **Multer & Cloudinary**: Buffer memory storage and image cloud upload integration
- **Razorpay**: Payment gateway integration with test mode signature validation
- **dotenv & CORS**: Environment configuration and cross-origin security

---

## 👥 User Roles & Access Control Matrix

| Feature / Action | Admin | Sales Person (Seller) | User (Customer) |
| :--- | :---: | :---: | :---: |
| **Browse / Search / Filter Products** | ✅ | ✅ | ✅ |
| **Wishlist & Cart Management** | — | — | ✅ |
| **Checkout & Razorpay Payment** | — | — | ✅ |
| **View Personal Order History** | — | — | ✅ |
| **Add New Products** | ✅ | ✅ | ❌ |
| **Edit Products** | ✅ (All) | ✅ (Own Products Only) | ❌ |
| **Delete Products** | ✅ (All) | ✅ (Own Products Only) | ❌ |
| **View Seller Orders & Revenue** | — | ✅ (Orders with own products) | — |
| **Manage User Roles** | ✅ | ❌ | ❌ |
| **Global Admin Dashboard & Stats** | ✅ | ❌ | ❌ |

---

## 🔑 Pre-seeded Test Accounts

Run `npm run seed` in the `server/` directory to generate test accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@ecommerce.com` | `Password123!` |
| **Sales Person** | `seller@ecommerce.com` | `Password123!` |
| **User** | `user@ecommerce.com` | `Password123!` |

---

## 🚀 Quick Setup Instructions

### 1. Backend Setup
```bash
cd server
npm install
npm run seed     # Populate database with sample users and products
npm run dev      # Starts Express API at http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install --legacy-peer-deps
npm run dev      # Starts Vite Dev Server at http://localhost:5173
```

---

## 🌐 API Endpoint Documentation

### Authentication
- `POST /register` - Register a new account (`Admin`, `Sales Person`, or `User`)
- `POST /login` - Authenticate credentials & receive JWT token
- `GET /profile` - Retrieve authenticated user profile `[Protected]`

### Users (Admin Only)
- `GET /api/users` - List all registered users `[Admin]`
- `PUT /api/users/:id/role` - Update user role (`User`, `Sales Person`, `Admin`) `[Admin]`

### Products
- `GET /api/products` - Search, filter by category & price range, pagination
- `GET /api/products/:id` - Product details
- `POST /api/products` - Create product + Cloudinary image upload `[Seller/Admin]`
- `PUT /api/products/:id` - Edit product `[Seller Owner/Admin]`
- `DELETE /api/products/:id` - Delete product `[Seller Owner/Admin]`

### Wishlist & Cart
- `GET /api/wishlist` - View user saved wishlist `[User]`
- `POST /api/wishlist` - Add product to wishlist `[User]`
- `DELETE /api/wishlist/:id` - Remove product from wishlist `[User]`
- `GET /api/cart` - View user shopping cart `[User]`
- `POST /api/cart` - Add item to cart `[User]`
- `PUT /api/cart` - Update cart item quantity `[User]`
- `DELETE /api/cart/:productId?` - Remove item or clear cart `[User]`

### Orders & Razorpay
- `POST /api/orders/create` - Initialize Razorpay Order `[User]`
- `POST /api/orders/verify` - Verify Razorpay payment signature & save Order `[User]`
- `GET /api/orders` - Role-filtered orders `[Protected]`
- `PUT /api/orders/:id/status` - Update order processing status `[Admin/Seller]`

### Dashboards
- `GET /api/dashboard/admin` - Global statistics, revenue aggregation, SVG charts `[Admin]`
- `GET /api/dashboard/seller` - Seller revenue, listed products, recent orders `[Seller]`
- `GET /api/dashboard/user` - Customer order metrics & counts `[User]`

---

## 🛠️ Deployment Instructions

### Backend (Render / Railway)
1. Push repository to GitHub.
2. Create a Web Service on Render connecting the `server` directory.
3. Set Environment Variables: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.
4. Set Build Command: `npm install` and Start Command: `npm start`.

### Frontend (Vercel / Netlify)
1. Import the repository into Vercel and set Root Directory to `client`.
2. Set Build Command: `npm run build` and Output Directory: `dist`.
3. Set Environment Variable: `VITE_API_URL` pointing to your deployed Backend URL.
