# Quick Start Guide - TBVector

Panduan cepat untuk menjalankan TBVector Web Client dalam 5 menit! ⚡

## 📦 Prerequisites Check

```bash
# Cek apakah sudah terinstall
node --version    # Harus >= 18
pnpm --version    # Harus >= 8
mongod --version  # Harus >= 6
```

Jika belum terinstall:
- Node.js: https://nodejs.org/
- pnpm: `npm install -g pnpm`
- MongoDB: https://www.mongodb.com/try/download/community

## 🚀 5-Minute Setup

### 1️⃣ Clone & Install (2 menit)

```bash
git clone <repository-url>
cd tbvector-web-client
pnpm install
```

### 2️⃣ Setup Environment (1 menit)

```bash
cp .env.example .env
```

Edit `.env` - minimal yang perlu diubah:
```env
MONGO_URI=mongodb://localhost:27017/tbvector
SESSION_SECRET=ganti-dengan-string-random-panjang
```

> 💡 Generate secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 3️⃣ Start MongoDB (30 detik)

```bash
# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Windows
net start MongoDB
```

### 4️⃣ Build CSS (30 detik)

```bash
pnpm build:css
```

### 5️⃣ Run Development Server (1 menit)

```bash
pnpm dev
```

## ✅ Verify Installation

Buka browser: **http://localhost:3000**

Anda akan melihat homepage TBVector!

## 🎯 First Steps

### 1. Register User Baru

1. Klik "Daftar" atau buka http://localhost:3000/auth/register
2. Isi form:
   - **Nama**: John Doe
   - **Email**: john@example.com
   - **Username**: johndoe
   - **Password**: password123 (min 6 karakter)
   - **Konfirmasi Password**: password123
3. Klik "Daftar Sekarang"

### 2. Login

1. Akan redirect ke login page
2. Login dengan:
   - **Email**: john@example.com
   - **Password**: password123
3. Klik "Masuk"

### 3. Explore Dashboard

Setelah login, Anda akan masuk ke dashboard!

## 🛠️ Development Commands

```bash
# Run dev server (dengan CSS watcher)
pnpm dev

# Run server only (tanpa CSS watcher)
pnpm dev:server

# Build untuk production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code
pnpm format
```

## 🐛 Troubleshooting

### Port 3000 sudah digunakan?

```bash
# Ubah PORT di .env
PORT=3001
```

### MongoDB tidak terkoneksi?

```bash
# Cek status MongoDB
sudo systemctl status mongod  # Linux
brew services list            # macOS

# Start MongoDB jika belum running
sudo systemctl start mongod   # Linux
brew services start mongodb-community  # macOS
```

### CSS tidak ter-load?

```bash
# Build CSS terlebih dahulu
pnpm build:css
```

### Session tidak persist?

Pastikan `SESSION_SECRET` di `.env` tidak kosong dan cukup panjang (min 32 karakter).

## 📚 Next Steps

- 📖 Baca [README.md](README.md) untuk dokumentasi lengkap
- 🎨 Customize UI di `src/views/`
- 🔧 Tambah fitur di `src/controllers/` dan `src/services/`
- 📊 Buat dashboard views
- 🚀 Deploy ke production (lihat README.md)

## 💡 Tips

1. **Hot Reload**: Server akan auto-reload saat file berubah
2. **CSS Watcher**: Tailwind akan auto-compile saat edit CSS
3. **Flash Messages**: Gunakan `req.flash()` untuk notifikasi user
4. **Error Handling**: Gunakan `HttpException` untuk custom errors
5. **TypeScript**: Code completion akan membantu development

## 🎓 Learning Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [TailwindCSS Docs](https://tailwindcss.com/)
- [EJS Docs](https://ejs.co/)
- [Socket.IO Docs](https://socket.io/)

## 🆘 Need Help?

- 📖 Check [README.md](README.md)
- 🐛 Report issues di GitHub Issues
- 💬 Join discussions di GitHub Discussions

---

**Happy Coding! 🎉**
