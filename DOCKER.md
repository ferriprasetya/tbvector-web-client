# 🐳 Docker Setup Guide

Panduan lengkap menjalankan TBVector Web Client menggunakan Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- pnpm (jika ingin build lokal dulu)

## Quick Start

### Development Mode

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start semua services (web + MongoDB)
docker-compose up -d

# 3. Check logs
docker-compose logs -f web
```

**Akses Aplikasi:**
- Web: http://localhost:3000
- MongoDB: localhost:27017
- Mongo Express: http://localhost:8081 (dengan `--profile dev`)

### Production Mode

```bash
# 1. Copy environment file untuk production
cp .env.production.example .env.production

# 2. Edit .env.production dan ganti semua CHANGE_THIS dengan nilai yang aman!
nano .env.production

# 3. Build dan start production containers
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Check status
docker-compose -f docker-compose.prod.yml ps

# 5. View logs
docker-compose -f docker-compose.prod.yml logs -f web
```

## Docker Compose Files

### docker-compose.yml (Development)

File ini digunakan untuk development dengan fitur:
- ✅ Hot-reload (source code di-mount sebagai volume)
- ✅ MongoDB dengan Mongo Express (optional)
- ✅ All dependencies terinstall
- ✅ CSS watcher untuk TailwindCSS

**Services:**
- `web` - Express.js app (port 3000)
- `tb_mongo` - MongoDB 5.0 (port 27017)
- `mongo-express` - MongoDB GUI (port 8081, profile: dev)

### docker-compose.prod.yml (Production)

File ini digunakan untuk production dengan fitur:
- ✅ Optimized build (multi-stage)
- ✅ Production dependencies only
- ✅ Pre-built TypeScript dan CSS
- ✅ Smaller image size
- ❌ No source code mounting
- ❌ No Mongo Express

**Services:**
- `web` - Express.js app (port 3000)
- `tb_mongo` - MongoDB 5.0 (port 27017)

## Commands

### Development

```bash
# Start all services
docker-compose up -d

# Start dengan Mongo Express
docker-compose --profile dev up -d

# Stop all services
docker-compose down

# Rebuild images
docker-compose up -d --build

# View logs
docker-compose logs -f
docker-compose logs -f web        # Web app only
docker-compose logs -f tb_mongo   # MongoDB only

# Restart specific service
docker-compose restart web

# Execute command in container
docker-compose exec web sh
docker-compose exec web pnpm install
docker-compose exec tb_mongo mongosh

# Remove all (including volumes)
docker-compose down -v
```

### Production

```bash
# Start production
docker-compose -f docker-compose.prod.yml up -d

# Rebuild
docker-compose -f docker-compose.prod.yml up -d --build

# Stop
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f web

# Scale web service
docker-compose -f docker-compose.prod.yml up -d --scale web=3
```

## Volumes

### Development Volumes

```yaml
volumes:
  - ./src:/app/src                    # Source code (hot-reload)
  - ./src/views:/app/src/views        # EJS templates
  - ./src/public:/app/src/public      # Static files + CSS
  - ./public/uploads:/app/public/uploads  # User uploads (persistent)
  - mongo-data:/data/db               # MongoDB data (persistent)
```

### Production Volumes

```yaml
volumes:
  - ./public/uploads:/app/public/uploads  # Only uploads
  - mongo-data:/data/db                   # MongoDB data
```

## Environment Variables

### Required Variables

```bash
# .env (development)
PORT=3000
NODE_ENV=development
SESSION_SECRET=dev_secret_key
MONGO_URI=mongodb://admin:admin123@tb_mongo:27017/tbvector?authSource=admin
```

```bash
# .env.production (production)
PORT=3000
NODE_ENV=production
SESSION_SECRET=<strong_random_secret>
MONGO_URI=mongodb://admin:<strong_password>@tb_mongo:27017/tbvector?authSource=admin
```

### Optional Variables

```bash
MONGO_HOST_PORT=27017           # MongoDB port mapping
MONGO_EXPRESS_PORT=8081         # Mongo Express port
MAX_FILE_SIZE=10485760          # 10MB upload limit
DEVICE_API_KEY=<api_key>        # IoT device authentication
```

## Dockerfile Stages

### Base Stage
- Node.js 18 Alpine
- pnpm installation
- netcat untuk health checks

### Development Stage
```dockerfile
FROM base AS development
- Install all dependencies
- Build CSS
- Hot-reload dengan ts-node-dev
```

### Production Stage
```dockerfile
FROM base AS production
- Install dependencies
- Build TypeScript + CSS
- Prune devDependencies
- Run compiled JavaScript
```

## Troubleshooting

### Container tidak start

```bash
# Check logs
docker-compose logs web

# Common issues:
# - MongoDB belum ready → tunggu beberapa detik
# - Port sudah digunakan → ganti di .env
# - Permission error → sudo chown -R $USER:$USER .
```

### MongoDB connection error

```bash
# Verify MongoDB is running
docker-compose ps tb_mongo

# Check MongoDB logs
docker-compose logs tb_mongo

# Test connection
docker-compose exec web sh
nc -zv tb_mongo 27017
```

### Hot-reload tidak berfungsi

```bash
# Pastikan volume mounted dengan benar
docker-compose exec web ls -la src/

# Restart web service
docker-compose restart web
```

### CSS tidak ter-compile

```bash
# Development: CSS di-watch otomatis
docker-compose logs -f web | grep tailwind

# Manual build CSS
docker-compose exec web pnpm build:css

# Production: CSS sudah pre-built saat build image
docker-compose -f docker-compose.prod.yml up -d --build
```

### Permission issues dengan uploads folder

```bash
# Fix ownership
sudo chown -R $USER:$USER public/uploads
chmod -R 755 public/uploads

# Atau buat folder dengan permission yang benar
mkdir -p public/uploads
chmod 755 public/uploads
```

## Production Deployment

### 1. Setup Environment

```bash
# Copy dan edit production env
cp .env.production.example .env.production
nano .env.production
```

**WAJIB diganti:**
- `SESSION_SECRET` - Random string (minimal 32 karakter)
- `MONGO_INITDB_ROOT_PASSWORD` - Strong password
- `DEVICE_API_KEY` - Secure API key
- `JWT_SECRET` - Random string (minimal 32 karakter)

### 2. Build & Deploy

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Verify
docker-compose -f docker-compose.prod.yml ps
```

### 3. Security Considerations

- ✅ Ganti semua default passwords
- ✅ Jangan expose MongoDB port ke public (atau gunakan firewall)
- ✅ Gunakan HTTPS dengan reverse proxy (Nginx/Caddy)
- ✅ Backup MongoDB secara berkala
- ✅ Monitor logs dan resource usage

### 4. Backup MongoDB

```bash
# Backup
docker-compose -f docker-compose.prod.yml exec tb_mongo \
  mongodump --username admin --password <password> \
  --authenticationDatabase admin --out /backup

# Copy backup keluar container
docker cp tbvector_mongo_prod:/backup ./backup

# Restore
docker-compose -f docker-compose.prod.yml exec tb_mongo \
  mongorestore --username admin --password <password> \
  --authenticationDatabase admin /backup
```

## Resource Limits

Untuk production, tambahkan resource limits di `docker-compose.prod.yml`:

```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Health Checks

```yaml
services:
  web:
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Monitoring

```bash
# Stats
docker stats tbvector_web

# Top processes
docker top tbvector_web

# Inspect container
docker inspect tbvector_web

# Resource usage
docker-compose -f docker-compose.prod.yml ps -q | xargs docker stats
```

## Tips & Best Practices

1. **Development:**
   - Gunakan `docker-compose up` tanpa `-d` untuk melihat logs langsung
   - Mount volume minimal untuk performance
   - Gunakan `--profile dev` untuk Mongo Express

2. **Production:**
   - Selalu build ulang setelah update code: `--build`
   - Gunakan named volumes untuk data persistence
   - Setup backup otomatis untuk MongoDB
   - Monitor resource usage

3. **Performance:**
   - Gunakan `.dockerignore` untuk exclude unnecessary files
   - Multi-stage build untuk smaller images
   - Prune unused images/volumes: `docker system prune -a`

4. **Security:**
   - Jangan commit `.env` atau `.env.production`
   - Rotate secrets secara berkala
   - Update base images secara berkala
   - Scan images untuk vulnerabilities

## Further Reading

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MongoDB Docker Guide](https://hub.docker.com/_/mongo)
