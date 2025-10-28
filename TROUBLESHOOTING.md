# Troubleshooting Guide

## Error: CORS Policy

### Error Message:
```
Access to XMLHttpRequest at 'http://localhost:3001/auth/login' from origin 'https://localhost:8443' 
has been blocked by CORS policy
```

### Solusi:
CORS sudah diperbaiki di backend. Backend sekarang menerima requests dari:
- `https://localhost:8443` (HTTPS frontend)
- `http://localhost:8080` (HTTP frontend)

### Restart Backend:
```bash
docker-compose restart backend
```

## Error: SSL Certificate

### Error Message:
```
net::ERR_CERT_AUTHORITY_INVALID
```

### Solusi:
Backend sekarang menggunakan HTTP (port 3001) untuk menghindari masalah SSL certificate di development.

Frontend menggunakan HTTP juga untuk komunikasi API.

## Error: Port Already in Use

### Error Message:
```
Error: listen EADDRINUSE: address already in use
```

### Solusi:
```bash
# Cek port yang digunakan
lsof -i :8080
lsof -i :8443
lsof -i :3001

# Kill process jika perlu
kill -9 <PID>

# Atau restart containers
docker-compose restart
```

## Error: Database Connection Failed

### Error Message:
```
Database connection failed
```

### Solusi:
```bash
# Cek database container
docker-compose ps database

# Restart database
docker-compose restart database

# Lihat logs
docker-compose logs database
```

## Reset Complete System

```bash
# Stop dan hapus semua containers, volumes, networks
docker-compose down -v

# Rebuild dan start
docker-compose up -d --build

# Tunggu hingga semua container healthy
docker-compose ps
```

## Check Service Health

```bash
# Status semua containers
docker-compose ps

# Logs real-time
docker-compose logs -f

# Logs specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

## Common Ports

| Service | Port | Status |
|---------|------|--------|
| Frontend HTTP | 8080 | ✓ |
| Frontend HTTPS | 8443 | ✓ |
| Backend API | 3001 | ✓ |
| Database | 5432 | ✓ |

## Login Credentials

```
Admin:  admin@hospital.com / Admin RD!
Dokter: dr.john@hospital.com / Dokter123!
Perawat: nurse.jane@hospital.com / Perawat123!
```

