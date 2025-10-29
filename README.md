# Patient Data Management System

Sistem manajemen data pasien dengan arsitektur client-server menggunakan Docker.

## Ringkasan

- Arsitektur: React (Nginx HTTPS) → Express API → PostgreSQL (TLS)
- Keamanan: HTTPS + HSTS, JWT via cookie HttpOnly Secure, CORS ketat, SQL parameterized, Audit log
- DB GUI: Adminer tersedia di http://localhost:5051

## Akses Aplikasi

- App (HTTPS): https://localhost:8443
- Adminer (DB GUI): http://localhost:5051

## Struktur Proyek

Sistem menggunakan 4 container Docker:
1. Frontend (React + Nginx) - 8080/8443
2. Backend (Node.js Express) - 3001→3000
3. Database (PostgreSQL TLS) - 5432
4. Adminer (DB GUI) - 5051→8080

## Cara Menjalankan (Quick Start)

```bash
# 1. Start semua services
docker-compose up -d --build

# 2. Check status
docker-compose ps

# 3. View logs
docker-compose logs -f
```

## Kredensial Uji

```
Admin:  admin@hospital.com / Admin123!
Dokter: dr.john@hospital.com / Dokter123!
Nurse:  nurse.jane@hospital.com / Perawat123!
```

## Catatan Keamanan

- HTTPS dipaksa (HSTS) untuk frontend; API di-proxy via Nginx `/api`
- Token auth disimpan sebagai cookie `HttpOnly; Secure; SameSite=Strict`
- Koneksi DB menggunakan TLS; Postgres dikonfigurasi `ssl=on`

## Setup SSL: Kapan perlu dilakukan?

Anda TIDAK perlu setup SSL setiap kali menjalankan project. Cukup jalankan `docker-compose up -d --build`.

Hanya lakukan setup/regenerasi SSL pada kondisi berikut:
- Pertama kali setup di mesin baru (folder `ssl/` belum ada)
- Anda menghapus folder `ssl/` atau mengganti hostname/CN sertifikat
- Sertifikat kedaluwarsa dan perlu diperbarui

Langkah setup SSL (hanya saat diperlukan):
```bash
# 1) Generate sertifikat self-signed untuk dev
./ssl/generate-certs.sh

# 2) Salin sertifikat frontend (sekali saat awal atau saat regenerate)
cp ssl/frontend-*.pem frontend/ssl/
cp ssl/ca-cert.pem frontend/ssl/

# 3) Jalankan stack
docker-compose up -d --build
```

## Alur rutin harian (run biasa)

```bash
docker-compose up -d --build
# App:     https://localhost:8443
# Adminer:  http://localhost:5051
```

## Login Adminer

- URL: http://localhost:5051
- System: PostgreSQL
- Server: database
- Database: patient_db
- Username: admin_user
- Password: SecureAdminPass123!
- SSL: require (opsional verifikasi CA: gunakan file `ssl/ca-cert.pem`)

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
docker-compose logs adminer
```

## Port Mapping

- Frontend: 8080 (HTTP), 8443 (HTTPS)
- Backend: 3000
- Database: 5432
