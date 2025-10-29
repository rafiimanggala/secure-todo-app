# 📋 Data Dummy untuk Testing

## ✅ Data Telah Dimasukkan

Berhasil menambahkan **5 data pasien** dan **5 rekam medis** ke database!

## 👥 Data Pasien

| ID | Nama | Jenis Kelamin | Golongan Darah | Status |
|----|------|---------------|----------------|--------|
| 1 | Siti Rahayu | Perempuan | A+ | Aktif |
| 2 | Bambang Sutrisno | Laki-laki | O+ | Aktif |
| 3 | Dewi Lestari | Perempuan | B+ | Aktif |
| 4 | Ahmad Fauzi | Laki-laki | AB+ | Aktif |
| 5 | Rina Handayani | Perempuan | A- | Aktif |

## 🏥 Data Rekam Medis

### Pasien 1 - Siti Rahayu
- **Diagnosis**: Kontrol rutin diabetes
- **Resep**: Metformin 500mg 2x sehari
- **Tanggal**: 2024-01-10
- **Status**: Aktif

### Pasien 2 - Bambang Sutrisno
- **Diagnosis**: Tonsilit্যে akut
- **Resep**: Amoxicillin 500mg 3x sehari
- **Tanggal**: 2024-01-08
- **Status**: Selesai

### Pasien 3 - Dewi Lestari
- **Diagnosis**: Kontrol hipertensi
- **Resep**: Amlodipine 5mg 1x sehari
- **Tanggal**: 2024-01-12
- **Status**: Aktif

### Pasien 4 - Ahmad Fauzi
- **Diagnosis**: Gastritis akut
- **Resep**: Omeprazole 20mg 1x sehari
- **Tanggal**: 2024-01-09
- **Status**: Aktif

### Pasien 5 - Rina Handayani
- **Diagnosis**: Pemeriksaan rutin
- **Resep**: Vitamin D3 1000 IU
- **Tanggal**: 2024-01-14
- **Status**: Aktif

## 🧪 Cara Testing

1. **Login** ke aplikasi di http://localhost:8080
2. **Klik "Patients"** di menu
3. Anda akan melihat 5 data pasien yang sudah ditambahkan
4. **Klik "View"** untuk melihat detail dan medical records
5. **Test dengan berbagai role**:
   - Admin: bisa semua CRUD
   - Dokter: bisa create & update
   - Perawat: hanya bisa read & update records

## 📊 Total Data Sekarang

- ✅ **8 Pasien** (3 dari init + 5 baru)
- ✅ **10 Medical Records** (5 dari init + 5 baru)
- ✅ **3 Users** (Admin, Dokter, Perawat)

## 🔄 Reset Data

Jika ingin mengulang dari awal:

```bash
# Hapus volume database
docker-compose down -v

# Start ulang (akan re-insert semua data)
docker-compose up -d --build
```

## ✅ Verifikasi

Cek data di browser:
http://localhost:808888 → Login → Patients

หรือgunakan command:
```bash
docker-compose exec database psql -U admin_user -d patient_db -c "SELECT COUNT(*) FROM patients;"
```

