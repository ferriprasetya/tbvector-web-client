# TBVector - Public Website

Sistem monitoring deteksi tuberkulosis dengan web interface lengkap menggunakan EJS, TailwindCSS, dan Express.js.

## 🚀 Fitur

- ✅ **Autentikasi Lengkap**: Login, Register, Logout dengan email
- ✅ **Public Homepage**: Landing page untuk pengunjung
- ✅ **Dashboard**: Real-time monitoring data
- ✅ **Device Management**: Kelola perangkat IoT
- ✅ **Cough Detection**: Monitoring deteksi batuk TB
- ✅ **Notifications**: Sistem notifikasi real-time dengan Socket.IO
- ✅ **Responsive Design**: TailwindCSS untuk UI modern
- ✅ **Role-based Access**: User dan Admin roles

## 📋 Prerequisites

- Node.js >= 18.x
- MongoDB
- pnpm (package manager)

## 🛠️ Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd tbvector-web-client
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/tbvector
SESSION_SECRET=your-super-secret-session-key
DEVICE_API_KEY=your-device-api-key
```

4. **Build CSS**
```bash
pnpm build:css
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
pnpm dev
```

Ini akan menjalankan:
- Server dengan hot-reload di `http://localhost:3000`
- TailwindCSS watch mode untuk auto-compile CSS

### Production Mode
```bash
# Build
pnpm build

# Start
pnpm start
```

## 📁 Struktur Proyek

```
src/
├── config/           # Konfigurasi (database, env)
├── controllers/      # Controllers untuk handle requests
├── middlewares/      # Custom middlewares
├── models/           # MongoDB models
├── routes/           # Route definitions
├── services/         # Business logic
├── types/            # TypeScript type definitions
├── views/            # EJS templates
│   ├── auth/         # Login, Register pages
│   ├── pages/        # Public pages (home)
│   ├── layouts/      # Layout templates
│   └── partials/     # Reusable components
├── public/           # Static files
│   ├── css/          # Stylesheets
│   └── js/           # Client-side JavaScript
└── server.ts         # Entry point
```

## 🎨 Tech Stack

- **Backend**: Express.js, TypeScript
- **Template Engine**: EJS
- **Styling**: TailwindCSS
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.IO
- **Session**: express-session
- **Authentication**: bcryptjs, custom session-based auth

## 📝 API Routes

### Public Routes
- `GET /` - Homepage
- `GET /auth/login` - Login page
- `POST /auth/login` - Handle login
- `GET /auth/register` - Register page
- `POST /auth/register` - Handle registration
- `GET /auth/logout` - Logout

### Protected Routes (Requires Authentication)
- `GET /dashboard` - Dashboard
- `GET /devices` - Device list
- `GET /coughs` - Cough detection data
- `GET /notifications` - Notifications

### Admin Only Routes
- `GET /users` - User management (admin only)

## 🔐 User Roles

- **user**: Regular user dengan akses ke dashboard dan fitur monitoring
- **admin**: Full access termasuk user management

## 🎯 Features Detail

### Authentication
- Email-based registration dan login
- Password hashing dengan bcryptjs
- Session management dengan express-session
- Flash messages untuk feedback

### UI/UX
- Responsive design dengan TailwindCSS
- Alpine.js untuk interaktivitas
- Real-time notifications
- Form validation client-side dan server-side

### Security
- Password hashing
- Session-based authentication
- CSRF protection
- Input validation
- Role-based access control

## 🧪 Development

### Lint Code
```bash
pnpm lint
```

### Format Code
```bash
pnpm format
```

## 📦 Build untuk Production

```bash
# Build CSS dan TypeScript
pnpm build

# Run production server
NODE_ENV=production pnpm start
```

## 🐛 Troubleshooting

### CSS tidak ter-compile
```bash
pnpm build:css
```

### Port sudah digunakan
Ubah `PORT` di file `.env`

### Database connection error
Pastikan MongoDB running dan `MONGO_URI` benar

## 📄 License

ISC

## 👥 Contributors

- Your Team

---

**TBVector** - Sistem Monitoring Deteksi TB © 2025
