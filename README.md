# Patient Data Management System

Sistem manajemen data pasien dengan arsitektur client-server menggunakan Docker.

## Status Saat Ini

✅ Database: Running dan healthy  
⚠️ Backend: Sedang diperbaiki  
✅ Frontend: Running di port 8080 dan 8443

## Akses Aplikasi

- **HTTP**: http://localhost:8080
- **HTTPS**: https://localhost:8443

## Struktur Proyek

Sistem menggunakan 3 container Docker:
1. Frontend (React + Nginx) - Port 8080/8443
2. Backend (Node.js Express) - Port 3000
3. Database (PostgreSQL) - Port 5432

## Cara Menjalankan

```bash
# 1. Start semua services
docker-compose up -d --build

# 2. Check status
docker-compose ps

# 3. View logs
docker-compose logs -f
```

## Default Users

```
Admin:  admin@hospital.com / Admin123!
Dokter: dr.john@hospital.com / Dokter123!
Nurse:  nurse.jane@hospital.com / Perawat123!
```

## Troubleshooting

### Reset Semua Container
```bash
docker-compose down -v
docker-compose up -d --build
```

### View Logs
```bash
docker-compose logs database
docker-compose logs backend
docker-compose logs frontend
```

## Port Mapping

- Frontend: 8080 (HTTP), 8443 (HTTPS)
- Backend: 3000
- Database: 5432
