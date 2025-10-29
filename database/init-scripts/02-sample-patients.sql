-- Insert 5 sample patients for testing

\c patient_db;

-- Sample patients with realistic Indonesian data
INSERT INTO patients (nama, nik_encrypted, tanggal_lahir, jenis_kelamin, alamat, telepon_encrypted, golongan_darah, riwayat_penyakit, status, created_by) VALUES
('Siti Rahayu', 'encrypted_nik_1001', '1992-05-15', 'Perempuan', 'Jl. Merdeka No. 45, Jakarta Selatan', 'encrypted_phone_1001', 'A+', 'Diabetes tipe 2', 'Aktif', 1),
('Bambang Sutrisno', 'encrypted_nik_1002', '1985-08-22', 'Laki-laki', 'Jl. Sudirman No. 123, Jakarta Pusat', 'encrypted_phone_1002', 'O+', NULL, 'Aktif', 1),
('Dewi Lestari', 'encrypted_nik_1003', '1990-12-03', 'Perempuan', 'Jl. Gatot Subroto No. 78, Jakarta Selatan', 'encrypted_phone_1003', 'B+', 'Hipertensi, Asma', 'Aktif', 1),
('Ahmad Fauzi', 'encrypted_nik_1004', '1988-03-18', 'Laki-laki', 'Jl. Kebon Jeruk No. 12, Jakarta Barat', 'encrypted_phone_1004', 'AB+', 'Gastritis kronis', 'Aktif', 1),
('Rina Handayani', 'encrypted_nik_1005', '1995-07-25', 'Perempuan', 'Jl. Ciputat Raya No. 89, Tangerang Selatan', 'encrypted_phone_1005', 'A-', NULL, 'Aktif', 1)
ON CONFLICT DO NOTHING;

-- Insert sample medical records for these patients
INSERT INTO medical_records (patient_id, diagnosis, resep, status, tanggal_kunjungan, catatan, created_by) VALUES
(1, 'Kontrol rutin diabetes', 'Metformin 500mg 2x sehari setelah makan', 'Aktif', '2024-01-10', 'Gula darah puasa: 125 mg/dL. Pasien dianjurkan diet rendah gula.', 2),
(2, 'Tonsilitis akut', 'Amoxicillin 500mg 3x sehari, Paracetamol 500mg bila demam', 'Selesai', '2024-01-08', 'Kondisi membaik setelah 5 hari pengobatan.', 2),
(3, 'Kontrol hipertensi', 'Lanjutkan Amlodipine 5mg 1x sehari, Raumusik 100mg 1x sehari', 'Aktif', '2024-01-12', 'Tekanan darah: 130/85 mmHg. Kondisi stabil.', 2),
(4, 'Gastritis akut', 'Omeprazole 20mg 1x sehari sebelum sarapan, Antasida bila perlu', 'Aktif', '2024-01-09', 'Pasien mengeluh nyeri ulu hati. Dianjurkan makan teratur.', 2),
(5, 'Pemeriksaan rutin', 'Vitamin D3 1000 IU 1x sehari', 'Aktif', '2024-01-14', 'Pasien dalam kondisi sehat. Pemeriksaan fisik normal.', 2)
ON CONFLICT DO NOTHING;

