# 🚀 Quick Start Guide

## ✅ Sistem Sudah Running!

Semua container sudah berhasil dijalankan:

- ✅ **Database**: Running di port 5432
- ✅ **Backend**: Running di port 3001 (HTTP)  
- ✅ **Frontend**: Running di port 8080 (HTTP) dan 8443 (HTTPS)

## 🌐 Akses Aplikasi

### Buka di Browser:
- **HTTP**: http://localhost:8080
- **HTTPS**: https://localhost:8443

## 🔐 Login dengan User Default

```
Admin:  admin@hospital.com / Admin123!
Dokter: dr.john@hospital.com / Dokter123!  
Perawat: nurse.jane@hospital.com / Perawat123!
```

## 📋 Port yang Digunakan

| Service | Port | URL |
|---------|------|-----|
| Frontend HTTP | 8080 | http://localhost:8080 |
| Frontend HTTPS | 8443 | https://localhost:8443 |
| Backend API | 3001 | http://localhost:3001 |
| Database | 5432 | localhost:5432 |

## 🛠️ Command Berguna

```bash
# Cek status container
docker-compose ps

# Restart semua service
docker-compose restart

# Lihat logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database

# Stop semua service
docker-compose down

# Reset dan rebuild
docker-compose down -v
docker-compose up -d --build
```

## 🐛 Troubleshooting

### Error SSL Certificate
Frontend sekarang menggunakan HTTP untuk komunikasi dengan backend (port 3001) untuk menghindari masalah SSL certificate.

### Reset Jika Ada Masalah
```bash
docker-compose down -v
docker-compose up -d --build
```

## ✅ Fitur Sistem

- ✅ Authentication dengan JWT
- ✅ 3 Role: Admin, Dokter, Perawat  
- ✅ Manajemen Pasien (CRUD)
- ✅ Medical Records
- ✅ Dashboard dengan statistics
- ✅ User Management (Admin only)
- ✅ Responsive UI

## 🎉 Selamat Menggunakan!

Sistem manajemen data pasien Anda siap digunakan!
