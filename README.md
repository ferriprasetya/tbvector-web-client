# TBVector Web Client

<div align="center">

![TBVector Logo](https://img.shields.io/badge/TBVector-Monitoring%20System-blue?style=for-the-badge)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Sistem Monitoring Deteksi Tuberkulosis dengan Machine Learning**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Tentang Proyek

TBVector adalah platform web fullstack untuk monitoring dan deteksi dini tuberkulosis (TB) menggunakan analisis suara batuk dengan teknologi machine learning. Sistem ini dirancang untuk membantu tenaga medis dalam monitoring pasien secara real-time.

### 🎯 Tujuan

- Deteksi dini TB melalui analisis pola batuk
- Monitoring real-time kondisi pasien
- Manajemen perangkat IoT untuk deteksi batuk
- Dashboard analitik untuk evaluasi data
- Sistem notifikasi otomatis untuk tindakan cepat

---

## ✨ Features

### 🔐 Autentikasi & Otorisasi

- ✅ Registrasi user dengan email verification
- ✅ Login berbasis email dengan session management
- ✅ Role-based access control (User & Admin)
- ✅ Password hashing dengan bcryptjs
- ✅ Session persistence dengan express-session

### 📊 Dashboard & Monitoring

- ✅ Real-time dashboard dengan statistik
- ✅ Visualisasi data dengan Chart.js
- ✅ Live updates dengan Socket.IO
- ✅ Filter dan pencarian data

### 📱 Device Management

- ✅ Manajemen multiple perangkat IoT
- ✅ Status monitoring (online/offline)
- ✅ Device configuration
- ✅ API key authentication untuk devices

### 🎤 Cough Detection

- ✅ Analisis suara batuk dengan ML
- ✅ Riwayat deteksi batuk
- ✅ Upload dan playback audio
- ✅ Klasifikasi hasil deteksi

### 🔔 Notifications

- ✅ Real-time notifications dengan Socket.IO
- ✅ Browser push notifications
- ✅ In-app notification system
- ✅ Email notifications (optional)

### 👥 User Management (Admin)

- ✅ CRUD users
- ✅ Role assignment
- ✅ User statistics
- ✅ Activity monitoring

### 🎨 UI/UX

- ✅ Responsive design dengan TailwindCSS
- ✅ Modern & clean interface
- ✅ Interactive components dengan Alpine.js
- ✅ Flash messages untuk feedback
- ✅ Loading states & error handling

---

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js (>= 18.x)
- **Framework**: Express.js 5
- **Language**: TypeScript 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Session-based (express-session)
- **Real-time**: Socket.IO

### Frontend

- **Template Engine**: EJS
- **Styling**: TailwindCSS 4
- **JavaScript**: Alpine.js (for interactivity)
- **Charts**: Chart.js
- **Icons**: Heroicons

### Development Tools

- **Package Manager**: pnpm
- **Dev Server**: ts-node-dev
- **Linting**: ESLint with TypeScript
- **Formatting**: Prettier
- **CSS Processing**: PostCSS with Autoprefixer

---

## 📋 Prerequisites

Pastikan sistem Anda memiliki:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **MongoDB** >= 6.x ([Download](https://www.mongodb.com/try/download/community))
- **pnpm** ([Install](https://pnpm.io/installation))
- **Git** ([Download](https://git-scm.com/))

### Cek Prerequisites

```bash
node --version   # v18.x.x atau lebih tinggi
pnpm --version   # 8.x.x atau lebih tinggi
mongod --version # v6.x.x atau lebih tinggi
```

---

## 🚀 Installation

Ada 2 cara untuk menjalankan aplikasi ini: **Docker** (recommended) atau **Manual**.

### Opsi 1: Docker (Recommended) 🐳

Cara paling mudah untuk development dan production. Lihat [DOCKER.md](./DOCKER.md) untuk panduan lengkap.

**Quick Start:**

```bash
# Clone repository
git clone https://github.com/yourusername/tbvector-web-client.git
cd tbvector-web-client

# Copy environment file
cp .env.example .env

# Start dengan Docker
docker-compose up -d

# Akses di http://localhost:3000
```

✅ Keuntungan:

- MongoDB sudah included
- Tidak perlu install dependencies manual
- Consistent environment
- Easy deployment

### Opsi 2: Manual Installation

#### 1. Clone Repository

```bash
git clone https://github.com/yourusername/tbvector-web-client.git
cd tbvector-web-client
```

#### 2. Install Dependencies

```bash
pnpm install
```

#### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` sesuai konfigurasi:

```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=your_super_secret_session_key_change_this_in_production
MONGO_URI=mongodb://localhost:27017/tbvector
DEVICE_API_KEY=your_device_api_key_change_this
```

> ⚠️ **PENTING**: Untuk production, ganti semua secret dengan string random yang kuat!

#### 4. Setup MongoDB

**Menggunakan MongoDB Lokal:**

```bash
# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Windows (as service)
net start MongoDB
```

**Menggunakan MongoDB Atlas (Cloud):**

1. Buat cluster di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Dapatkan connection string
3. Update `MONGO_URI` di `.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tbvector?retryWrites=true&w=majority
```

#### 5. Build CSS

```bash
pnpm build:css
```

---

## 💻 Usage

### Development Mode

Jalankan server development dengan hot-reload dan CSS watch:

```bash
pnpm dev
```

Ini akan menjalankan:

- ✅ Server di `http://localhost:3000` dengan auto-reload
- ✅ TailwindCSS watcher untuk auto-compile CSS
- ✅ TypeScript transpilation

**Output:**

```
Server running on http://0.0.0.0:3000
Connected to MongoDB
TailwindCSS watching for changes...
```

### Production Mode

#### 1. Build Project

```bash
# Build TypeScript dan CSS
pnpm build
```

Ini akan:

- ✅ Compile TypeScript → JavaScript di folder `dist/`
- ✅ Minify CSS → `src/public/css/output.css`

#### 2. Start Production Server

```bash
NODE_ENV=production pnpm start
```

**Atau dengan PM2 (Recommended):**

```bash
# Install PM2 globally
npm install -g pm2

# Start dengan PM2
pm2 start dist/server.js --name tbvector

# Monitoring
pm2 status
pm2 logs tbvector
pm2 monit

# Auto-restart on system reboot
pm2 startup
pm2 save
```

### Using Docker

#### Development Mode

```bash
# Start containers (termasuk MongoDB dan Mongo Express)
docker-compose up -d

# View logs
docker-compose logs -f web

# Stop containers
docker-compose down

# Rebuild setelah perubahan dependencies
docker-compose up -d --build
```

**Akses:**

- Web App: `http://localhost:3000`
- Mongo Express: `http://localhost:8081` (username/password: admin/admin123)

**Note:** Mongo Express hanya berjalan di development mode (gunakan `--profile dev`)

```bash
# Jalankan dengan Mongo Express
docker-compose --profile dev up -d
```

#### Production Mode

```bash
# Build dan jalankan production
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

**Perbedaan Dev vs Prod:**
| Feature | Development | Production |
|---------|------------|-----------|
| Hot Reload | ✅ Yes | ❌ No |
| Source Maps | ✅ Yes | ❌ No |
| CSS Watch | ✅ Yes | ❌ Pre-built |
| Dependencies | All | Production only |
| Image Size | Larger | Smaller |
| Mongo Express | Optional (--profile dev) | ❌ Not included |

---

## 📁 Project Structure

```
tbvector-web-client/
├── src/
│   ├── config/              # Konfigurasi aplikasi
│   │   ├── db.ts           # MongoDB connection
│   │   └── env.ts          # Environment variables
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── device.controller.ts
│   │   ├── cough.controller.ts
│   │   └── coughNotification.controller.ts
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── locals.middleware.ts
│   │   ├── errorHandler.ts
│   │   └── upload.ts
│   ├── models/              # Mongoose models
│   │   ├── user.model.ts
│   │   ├── device.model.ts
│   │   ├── cough.model.ts
│   │   └── coughNotification.model.ts
│   ├── routes/              # API & Web routes
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── dashboard.routes.ts
│   │   └── ...
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── device.service.ts
│   │   └── ...
│   ├── types/               # TypeScript types
│   │   └── session.d.ts
│   ├── utils/               # Utility functions
│   │   ├── HttpException.ts
│   │   └── errors.ts
│   ├── views/               # EJS templates
│   │   ├── auth/
│   │   │   ├── login.ejs
│   │   │   └── register.ejs
│   │   ├── pages/
│   │   │   └── home.ejs
│   │   ├── layouts/
│   │   │   └── main.ejs
│   │   ├── partials/
│   │   │   ├── navbar.ejs
│   │   │   ├── sidebar.ejs
│   │   │   ├── footer.ejs
│   │   │   └── flash.ejs
│   │   └── error.ejs
│   ├── public/              # Static assets
│   │   ├── css/
│   │   │   ├── input.css   # Tailwind source
│   │   │   └── output.css  # Compiled CSS
│   │   ├── js/
│   │   │   ├── main.js
│   │   │   └── socket.js
│   │   └── uploads/        # User uploads
│   ├── listeners/           # Socket.IO listeners
│   └── server.ts           # Entry point
├── dist/                    # Compiled JavaScript (gitignored)
├── docs/                    # Documentation
├── .env                     # Environment variables (gitignored)
├── .env.example            # Environment template
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start dev server with hot-reload
pnpm dev:server       # Start server only (without CSS watcher)
pnpm dev:css          # Watch and compile CSS only

# Build
pnpm build            # Build TypeScript + CSS for production
pnpm build:css        # Build and minify CSS only

# Production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm format           # Format TypeScript & EJS files with Prettier
pnpm format:ejs       # Format only EJS files with Prettier

# Testing (if implemented)
pnpm test             # Run tests
```

### 🎨 Code Formatting

Project ini menggunakan Prettier untuk formatting otomatis, termasuk untuk file **EJS**.

**Format on Save (VS Code):**

```json
// .vscode/settings.json sudah dikonfigurasi
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

**Manual Formatting:**

```bash
# Format semua file TypeScript dan EJS
pnpm format

# Format hanya file EJS
pnpm format:ejs
```

**Konfigurasi Prettier:**

- File EJS menggunakan HTML parser
- Single quotes untuk strings
- No semicolons
- Tab width: 2 spaces
- Print width: 80 characters
- Trailing commas: all

---

## 🌐 Routes & Endpoints

### Public Routes

- `GET /` - Homepage (landing page)
- `GET /auth/login` - Login page
- `POST /auth/login` - Handle login
- `GET /auth/register` - Registration page
- `POST /auth/register` - Handle registration

### Protected Routes (Requires Login)

- `GET /dashboard` - Main dashboard
- `GET /devices` - Device management
- `GET /devices/:id` - Device details
- `GET /coughs` - Cough detection data
- `GET /coughs/:id` - Cough details
- `GET /notifications` - Notification center
- `GET /profile` - User profile

### Admin Routes (Requires Admin Role)

- `GET /users` - User management
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

---

## 🔒 Security

### Implemented Security Measures

1. **Authentication**
   - Session-based authentication dengan `express-session`
   - Password hashing dengan `bcryptjs` (10 rounds)
   - Secure session cookies (httpOnly, sameSite)

2. **Authorization**
   - Role-based access control (RBAC)
   - Protected routes dengan middleware
   - Admin-only features

3. **Input Validation**
   - MongoDB ObjectId validation
   - Email format validation
   - Password strength requirements (min 6 chars)
   - Username pattern validation

4. **Error Handling**
   - Custom HttpException untuk error handling
   - Sanitized error messages untuk production
   - Logging untuk debugging

5. **Data Protection**
   - Password field tidak di-return dalam responses
   - CORS configuration
   - Helmet.js (recommended untuk production)

### Security Best Practices

```bash
# 1. Generate strong secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# 2. Update .env dengan secrets yang kuat
SESSION_SECRET=<generated-secret-here>
JWT_SECRET=<another-generated-secret>

# 3. Setup HTTPS di production (gunakan reverse proxy seperti Nginx)
```

---

## 📊 Database Schema

### User Model

```typescript
{
  email: String (unique, required)
  username: String (unique, required, 3-30 chars)
  name: String (required)
  password: String (hashed, min 6 chars)
  role: 'user' | 'admin' (default: 'user')
  isEmailVerified: Boolean (default: false)
  avatar: String (optional)
  bio: String (max 500 chars, optional)
  createdAt: Date
  updatedAt: Date
}
```

### Device Model

```typescript
{
  deviceId: String (unique, required)
  name: String
  location: String
  status: 'online' | 'offline' | 'maintenance'
  lastActive: Date
  owner: ObjectId (ref: 'User')
  createdAt: Date
  updatedAt: Date
}
```

### Cough Model

```typescript
{
  deviceId: ObjectId (ref: 'Device')
  audioFile: String
  classification: String
  confidence: Number
  detectedAt: Date
  metadata: Object
  createdAt: Date
  updatedAt: Date
}
```

---

## 🧪 Testing

### Manual Testing

1. **Test Registration**

```bash
# Buka browser: http://localhost:3000/auth/register
# Isi form dan submit
```

2. **Test Login**

```bash
# Login dengan credentials yang baru dibuat
```

3. **Test Protected Routes**

```bash
# Akses /dashboard tanpa login → redirect ke /auth/login
# Login terlebih dahulu → akses berhasil
```

### API Testing dengan curl

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt

# Access protected route
curl http://localhost:3000/dashboard \
  -b cookies.txt
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Error: EADDRINUSE: address already in use :::3000

# Solusi 1: Ubah PORT di .env
PORT=3001

# Solusi 2: Kill process yang menggunakan port
lsof -ti:3000 | xargs kill -9  # macOS/Linux
```

### MongoDB Connection Error

```bash
# Error: MongoNetworkError

# Cek apakah MongoDB running
sudo systemctl status mongod  # Linux
brew services list            # macOS

# Start MongoDB
sudo systemctl start mongod   # Linux
brew services start mongodb-community  # macOS
```

### CSS Not Loading

```bash
# Build CSS terlebih dahulu
pnpm build:css

# Atau jalankan watcher
pnpm dev:css
```

### Session Not Persisting

```bash
# Cek SESSION_SECRET di .env
# Pastikan tidak kosong dan cukup panjang (min 32 karakter)
```

### Permission Denied

```bash
# Error: EACCES: permission denied

# Solusi: Ubah ownership folder
sudo chown -R $USER:$USER .
```

---

## 📚 Documentation

- [User Service Documentation](docs/USER_SERVICE.md)
- [Migration Guide](MIGRATION_GUIDE.md)
- [API Documentation](docs/API.md) (coming soon)
- [Deployment Guide](docs/DEPLOYMENT.md) (coming soon)

---

## 🚀 Deployment

### Deploy ke VPS (Ubuntu/Debian)

```bash
# 1. Install dependencies
sudo apt update
sudo apt install -y nodejs npm mongodb

# 2. Install pnpm
npm install -g pnpm

# 3. Clone & setup
git clone <your-repo>
cd tbvector-web-client
pnpm install
cp .env.example .env
# Edit .env dengan konfigurasi production

# 4. Build
pnpm build

# 5. Install PM2
npm install -g pm2

# 6. Start dengan PM2
pm2 start dist/server.js --name tbvector
pm2 startup
pm2 save

# 7. Setup Nginx reverse proxy
sudo apt install nginx
# Configure Nginx (see docs/DEPLOYMENT.md)
```

### Deploy ke Heroku

```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Create app
heroku create tbvector-app

# 4. Add MongoDB addon
heroku addons:create mongolab

# 5. Set environment variables
heroku config:set SESSION_SECRET=your-secret
heroku config:set NODE_ENV=production

# 6. Deploy
git push heroku main

# 7. Open app
heroku open
```

### Deploy ke Railway/Render

Lihat dokumentasi platform masing-masing untuk deployment guide.

---

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Coding Standards

- Gunakan TypeScript untuk type safety
- Ikuti ESLint rules
- Format code dengan Prettier
- Tulis komentar yang jelas
- Update documentation jika diperlukan

---

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - _Initial work_ - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Express.js team untuk framework yang powerful
- TailwindCSS untuk utility-first CSS framework
- MongoDB team untuk NoSQL database
- Socket.IO untuk real-time communication
- Semua contributors dan open-source community

---

## 📞 Contact & Support

- **Email**: your.email@example.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/tbvector-web-client/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/tbvector-web-client/discussions)

---

<div align="center">

**Made with ❤️ for better TB detection and monitoring**

⭐ Star this repository if you find it helpful!

</div>
