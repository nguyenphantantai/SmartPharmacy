# 📋 TỔNG QUAN CÔNG NGHỆ VÀ GIẢI PHÁP - HỆ THỐNG QUẢN LÝ NHÀ THUỐC THÔNG MINH

## 🏗️ KIẾN TRÚC TỔNG QUAN

Dự án được chia thành **2 phần chính**:

1. **ReactSinglepage** - Frontend + Server-side rendering (Full-stack React)
2. **Backend_ReactSinglepage** - Backend API độc lập (Express.js + MongoDB)

---

## 📦 PHẦN 1: REACTSINGLEPAGE (Frontend + SSR Server)

### 🎯 Mục đích
- Ứng dụng web single-page với React
- Server-side rendering và API proxy
- Quản lý sản phẩm, đơn hàng, giỏ hàng
- Tích hợp AI chat tư vấn thuốc

### 🛠️ Công nghệ sử dụng

#### **Frontend Framework & Build Tools**
- **React 18.3.1** - UI framework
- **Vite 7.1.5** - Build tool và dev server
- **TypeScript 5.6.3** - Type safety
- **Wouter 3.3.5** - Client-side routing (lightweight alternative to React Router)

#### **UI Components & Styling**
- **Radix UI** - Headless UI components (Accordion, Dialog, Dropdown, Toast, etc.)
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **Framer Motion 11.13.1** - Animation library
- **Lucide React** - Icon library
- **React Icons** - Additional icons

#### **State Management & Data Fetching**
- **TanStack React Query 5.60.5** - Server state management và caching
- **React Context API** - Client state (AuthContext, FilterContext, PrescriptionContext)
- **React Hook Form 7.55.0** - Form management
- **Zod 3.24.2** - Schema validation

#### **Backend Integration**
- **Express.js 4.21.2** - Server framework
- **Express Session** - Session management
- **Passport.js** - Authentication middleware
- **WebSocket (ws)** - Real-time communication

#### **Database & ORM**
- **Drizzle ORM 0.39.1** - Type-safe ORM
- **PostgreSQL** - Database (qua Neon Serverless hoặc Supabase)
- **Drizzle Kit** - Migration tool

#### **Cloud Services & Storage**
- **Supabase 2.86.2** - Backend as a Service (Database, Storage, Auth)
- **Firebase 10.14.1** - Authentication (OTP), Storage
- **Neon Database** - Serverless PostgreSQL

#### **Features & Libraries**
- **React QR Code** - QR code generation
- **Recharts 2.15.2** - Data visualization
- **Date-fns 3.6.0** - Date manipulation
- **React Day Picker** - Date picker component
- **Embla Carousel** - Carousel component

### 📁 Cấu trúc thư mục

```
ReactSinglepage/
├── client/              # Frontend React app
│   ├── src/
│   │   ├── api/         # API clients
│   │   ├── components/  # React components
│   │   │   └── ui/      # shadcn/ui components
│   │   ├── contexts/    # React Context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities (Firebase, Supabase, utils)
│   │   ├── pages/       # Page components (187 files)
│   │   ├── services/    # Business logic services
│   │   └── utils/       # Helper functions
│   └── public/          # Static assets
├── server/              # Express server
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts        # Storage utilities
│   └── vite.ts          # Vite integration
├── shared/              # Shared code between client/server
│   └── schema.ts        # Drizzle schema definitions
└── dist/                # Build output
```

### 🔑 Tính năng chính

1. **E-commerce Features**
   - Product catalog với categories
   - Shopping cart
   - Checkout và payment
   - Order tracking
   - Coupon và promotion system

2. **Medicine Management**
   - Medicine product grid
   - Prescription upload và analysis
   - AI chat tư vấn thuốc
   - Medicine lookup và search

3. **User Management**
   - Authentication (Firebase OTP, Passport)
   - User profile
   - Address management
   - Order history

4. **AI Integration**
   - Chat bot tư vấn thuốc
   - Prescription OCR analysis
   - Medicine recommendation

---

## 🔧 PHẦN 2: BACKEND_REACTSINGLEPAGE (Backend API)

### 🎯 Mục đích
- RESTful API backend độc lập
- Quản lý database (MongoDB)
- Business logic và services
- Tích hợp AI, OCR, Payment gateways

### 🛠️ Công nghệ sử dụng

#### **Backend Framework**
- **Express.js 4.21.2** - Web framework
- **TypeScript 5.6.3** - Type safety
- **Node.js** - Runtime environment

#### **Database**
- **MongoDB 8.0.0** (Mongoose) - NoSQL database
- **PostgreSQL** (qua Drizzle) - SQL database (optional)
- **Supabase** - Cloud database và storage

#### **Authentication & Security**
- **JWT (jsonwebtoken)** - Token-based auth
- **Bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Rate limiting
- **Express Validator** - Input validation

#### **File Upload & Storage**
- **Multer** - File upload middleware
- **Cloudinary** - Cloud image storage
- **Firebase Admin** - Firebase services
- **Supabase Storage** - File storage

#### **AI & Machine Learning**
- **Google Generative AI** - Gemini AI models
- **OpenAI** - GPT models
- **Tesseract.js** - OCR (Optical Character Recognition)
- Trained data: `vie.traineddata`, `eng.traineddata`

#### **Payment Integration**
- **VNPay** - Vietnamese payment gateway
- **MoMo** - Mobile payment

#### **Other Services**
- **Nodemailer** - Email service
- **Compression** - Response compression
- **Morgan** - HTTP request logger

### 📁 Cấu trúc thư mục

```
Backend_ReactSinglepage/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # MongoDB connection
│   │   └── index.ts     # App config
│   ├── controllers/     # Request handlers (20+ controllers)
│   │   ├── authController.ts
│   │   ├── medicineController.ts
│   │   ├── orderController.ts
│   │   ├── prescriptionController.ts
│   │   ├── chatController.ts
│   │   └── ...
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # Authentication
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   └── trackingMiddleware.ts
│   ├── models/          # Database schemas
│   │   └── schema.ts    # Mongoose schemas
│   ├── routes/          # API routes (20+ route files)
│   │   ├── authRoutes.ts
│   │   ├── medicineRoutes.ts
│   │   ├── orderRoutes.ts
│   │   └── ...
│   ├── services/        # Business logic services
│   │   ├── aiService.ts
│   │   ├── ocrService.ts
│   │   ├── medicineMatchingService.ts
│   │   ├── momoService.ts
│   │   ├── vnpayService.ts
│   │   └── ...
│   ├── utils/           # Utility scripts
│   │   ├── seed.ts
│   │   ├── backupDatabase.ts
│   │   └── ...
│   └── index.ts         # Server entry point
├── medicine-images/     # Medicine image storage
└── uploads/             # Upload directory
```

### 🔑 API Endpoints chính

1. **Authentication** (`/api/auth`)
   - Register, Login, Logout
   - OTP verification
   - Password reset

2. **Products & Medicines** (`/api/products`, `/api/medicines`)
   - CRUD operations
   - Search và filter
   - Category management

3. **Orders** (`/api/orders`)
   - Create order
   - Order tracking
   - Order history

4. **Cart** (`/api/cart`)
   - Add/remove items
   - Update quantities

5. **Prescriptions** (`/api/prescriptions`)
   - Upload prescription
   - OCR analysis
   - Prescription matching

6. **Chat & AI** (`/api/chat`)
   - AI chat tư vấn thuốc
   - Medicine recommendations

7. **Payment** (`/api/payment`)
   - VNPay integration
   - MoMo integration
   - Payment callbacks

8. **Coupons & Promotions** (`/api/coupons`, `/api/promotions`)
   - Coupon management
   - Promotion campaigns

9. **Loyalty** (`/api/loyalty`)
   - Points system
   - Rewards

10. **Inventory** (`/api/inventory`)
    - Stock management
    - Expiration tracking

11. **Reports** (`/api/reports`)
    - Sales reports
    - Analytics

### 🤖 AI Features

#### **Chat Tư Vấn Thuốc**
- Sử dụng Google Generative AI (Gemini)
- Hỏi 4 câu thông tin an toàn:
  1. Tuổi
  2. Mang thai/cho con bú
  3. Dị ứng
  4. Bệnh nền
- Trả lời theo format chuẩn với danh sách thuốc cụ thể
- Cảnh báo các trường hợp nguy hiểm (sốt cao, khó thở, etc.)

#### **OCR Prescription Analysis**
- Sử dụng Tesseract.js
- Nhận diện text từ hình ảnh đơn thuốc
- Phân tích và extract thông tin thuốc
- Matching với database thuốc

#### **Medicine Matching Service**
- So khớp tên thuốc từ prescription với database
- Fuzzy matching
- Brand name matching

---

## 🔄 KIẾN TRÚC TỔNG THỂ

### **Luồng dữ liệu**

```
┌─────────────────┐
│   React Client  │
│  (ReactSinglepage)│
└────────┬────────┘
         │ HTTP/WebSocket
         │
┌────────▼────────┐
│  Express Server │
│ (ReactSinglepage)│
│  - SSR/Proxy    │
└────────┬────────┘
         │
         │ API Calls
         │
┌────────▼──────────────┐
│  Backend API Server   │
│ (Backend_ReactSinglepage)│
│  - Business Logic     │
│  - Database Access    │
└────────┬──────────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│MongoDB│ │Supabase│
│       │ │PostgreSQL│
└───────┘ └────────┘
```

### **Database Strategy**

1. **MongoDB** (Backend)
   - User data
   - Orders
   - Cart
   - Prescriptions
   - Chat history
   - Inventory

2. **PostgreSQL/Supabase** (Frontend)
   - Products catalog
   - Categories
   - Shared schema (Drizzle ORM)

3. **Supabase Storage**
   - Medicine images
   - Prescription images
   - User avatars

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### **Frontend (ReactSinglepage)**
- **Firebase Authentication** - OTP verification
- **Passport.js** - Local strategy
- **Express Session** - Session management
- **Context API** - Auth state management

### **Backend (Backend_ReactSinglepage)**
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Middleware** - Auth protection
- **Role-based access** - Customer/Admin

---

## 📊 DATA MODELS CHÍNH

### **MongoDB Schemas (Backend)**
- **User** - Thông tin người dùng
- **Product** - Sản phẩm/thuốc
- **Category** - Danh mục
- **Order** - Đơn hàng
- **Cart** - Giỏ hàng
- **Prescription** - Đơn thuốc
- **Coupon** - Mã giảm giá
- **Promotion** - Khuyến mãi
- **Loyalty** - Điểm thưởng
- **Inventory** - Tồn kho
- **Invoice** - Hóa đơn
- **Supplier** - Nhà cung cấp

### **PostgreSQL Schemas (Frontend)**
- **products** - Sản phẩm
- **categories** - Danh mục

---

## 🚀 DEPLOYMENT & BUILD

### **ReactSinglepage**
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

- **Build tool**: Vite + esbuild
- **Output**: `dist/` directory
- **Deployment**: Vercel (có `vercel.json`)

### **Backend_ReactSinglepage**
```bash
# Development
npm run dev

# Production
npm start
```

- **Runtime**: Node.js với tsx
- **Database**: MongoDB connection
- **Environment**: Dotenv config

---

## 🔧 CONFIGURATION FILES

### **ReactSinglepage**
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript config
- `tailwind.config.ts` - Tailwind CSS config
- `drizzle.config.ts` - Database migrations
- `components.json` - shadcn/ui config
- `vercel.json` - Vercel deployment config

### **Backend_ReactSinglepage**
- `tsconfig.json` - TypeScript config
- `drizzle.config.ts` - Database config
- `.env` - Environment variables

---

## 📝 TESTING & QUALITY

### **AI Test Cases**
- File `TEST_CASES_AI.md` với 42 test cases
- Test chat tư vấn thuốc
- Test follow-up conversations
- Test edge cases và safety checks

---

## 🎯 ĐIỂM MẠNH CỦA GIẢI PHÁP

1. **Separation of Concerns**
   - Frontend và Backend tách biệt
   - Dễ maintain và scale

2. **Type Safety**
   - TypeScript end-to-end
   - Drizzle ORM type-safe queries

3. **Modern Stack**
   - React 18 với hooks
   - Vite cho fast development
   - TanStack Query cho data fetching

4. **AI Integration**
   - Google Gemini AI
   - OCR với Tesseract
   - Smart medicine matching

5. **Scalability**
   - MongoDB cho flexible schema
   - PostgreSQL cho structured data
   - Cloud storage (Supabase, Cloudinary)

6. **Security**
   - JWT authentication
   - Rate limiting
   - Input validation
   - Helmet security headers

---

## 🔮 HƯỚNG PHÁT TRIỂN

1. **Performance**
   - Caching strategies
   - CDN integration
   - Image optimization

2. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

3. **Monitoring**
   - Error tracking
   - Performance monitoring
   - Analytics

4. **Features**
   - Real-time notifications
   - Advanced search
   - Recommendation engine
   - Mobile app

---

## 📚 TÀI LIỆU THAM KHẢO

- React: https://react.dev
- Vite: https://vitejs.dev
- Drizzle ORM: https://orm.drizzle.team
- TanStack Query: https://tanstack.com/query
- Supabase: https://supabase.com
- Firebase: https://firebase.google.com
- MongoDB: https://www.mongodb.com
- Express.js: https://expressjs.com

---

**Tài liệu này được tạo tự động dựa trên phân tích codebase.**
**Cập nhật lần cuối: 2024**

