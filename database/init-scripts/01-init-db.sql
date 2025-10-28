-- Patient Data System - Database Initialization Script
-- This script creates the schema, tables, and database users with RBAC

\c patient_db;

-- =============================================
-- 1. CREATE TABLES
-- =============================================

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'dokter', 'perawat')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    nik_encrypted TEXT NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin VARCHAR(10) NOT NULL CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
    alamat TEXT NOT NULL,
    telepon_encrypted TEXT NOT NULL,
    golongan_darah VARCHAR(3) CHECK (golongan_darah IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    riwayat_penyakit TEXT,
    status VARCHAR(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Selesai')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    diagnosis TEXT,
    resep TEXT,
    status VARCHAR(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Selesai')),
    tanggal_kunjungan DATE NOT NULL,
    catatan TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    action VARCHAR(20) NOT NULL CHECK (action IN ('CREATE', 'READ', 'UPDATE', 'DELETE')),
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET
);

-- Create indexes for performance
CREATE INDEX idx_patients_nama ON patients(nama);
CREATE INDEX idx_patients_tanggal_lahir ON patients(tanggal_lahir);
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX idx_medical_records_tanggal_kunjungan ON medical_records(tanggal_kunjungan);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- =============================================
-- 2. CREATE DATABASE USERS WITH RBAC
-- =============================================

-- Create database users
CREATE USER doctor_user WITH PASSWORD 'SecureDoctorPass123!';
CREATE USER nurse_user WITH PASSWORD 'SecureNursePass123!';

-- Grant connect privilege
GRANT CONNECT ON DATABASE patient_db TO doctor_user;
GRANT CONNECT ON DATABASE patient_db TO nurse_user;

-- =============================================
-- 3. GRANT PRIVILEGES
-- =============================================

-- Grant USAGE on schema (admin_user already owns it)
GRANT USAGE ON SCHEMA public TO doctor_user, nurse_user;

-- Grant appropriate privileges based on role

-- Doctor privileges: SELECT, INSERT, UPDATE on patients and medical_records
GRANT SELECT, INSERT, UPDATE ON patients TO doctor_user;
GRANT SELECT, INSERT, UPDATE ON medical_records TO doctor_user;
GRANT SELECT ON users TO doctor_user; -- Can see user info for attribution
GRANT USAGE, SELECT ON SEQUENCE patients_id_seq TO doctor_user;
GRANT USAGE, SELECT ON SEQUENCE medical_records_id_seq TO doctor_user;

-- Nurse privileges: SELECT on patients, SELECT and UPDATE on medical_records
GRANT SELECT ON patients TO nurse_user;
GRANT SELECT, UPDATE ON medical_records TO nurse_user;
GRANT SELECT ON users TO nurse_user; -- Can see user info for attribution

-- Grant read access to audit logs for both users
GRANT SELECT ON audit_logs TO doctor_user, nurse_user;

-- =============================================
-- 4. CREATE FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 5. INSERT DEFAULT USERS
-- =============================================

-- Note: Passwords are bcrypt hashed (work factor 10)
-- Admin: Admin123!
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@hospital.com', '$2a$10$HojbpLE6WYDKn4.yq10PBOtTLAnpSCbHQFZUdxzPHwxr9U9hK9qh.', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Doctor: Dokter123!
INSERT INTO users (username, email, password_hash, role) VALUES
('dr.john', 'dr.john@hospital.com', '$2a$10$bSr54UGgvvVuG/t1fKClS.LaXO9/JBz7YUkVLh/YrH/ONKz8OU/5K', 'dokter')
ON CONFLICT (email) DO NOTHING;

-- Nurse: Perawat123!
INSERT INTO users (username, email, password_hash, role) VALUES
('nurse.jane', 'nurse.jane@hospital.com', '$2a$10$/53gGaZ9MUoGodKyVw8l/.Ha7kKjN9qs6nu3pfL0LDokgTBN7J45S', 'perawat')
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- 6. INSERT SAMPLE DATA (for testing)
-- =============================================

-- Insert sample patients
INSERT INTO patients (nama, nik_encrypted, tanggal_lahir, jenis_kelamin, alamat, telepon_encrypted, golongan_darah, riwayat_penyakit, created_by) VALUES
('Budi Santoso', 'encrypted_nik_001', '1985-05-15', 'Laki-laki', 'Jl. Sudirman No. 123, Jakarta', 'encrypted_phone_001', 'O+', 'Diabetes tipe 2', 1),
('Siti Nurhaliza', 'encrypted_nik_002', '1990-08-22', 'Perempuan', 'Jl. Gatot Subroto No. 45, Jakarta', 'encrypted_phone_002', 'A+', NULL, 1),
('Ahmad Hidayat', 'encrypted_nik_003', '1978-12-03', 'Laki-laki', 'Jl. Thamrin No. 78, Jakarta', 'encrypted_phone_003', 'B+', 'Hipertensi', 1)
ON CONFLICT DO NOTHING;

-- Insert sample medical records
INSERT INTO medical_records (patient_id, diagnosis, resep, status, tanggal_kunjungan, catatan, created_by) VALUES
(1, 'Diabetes tipe 2 tidak terkontrol', 'Metformin 500mg 2x sehari setelah makan', 'Aktif', '2024-01-15', 'Pasien perlu kontrol rutin setiap 2 minggu', 2),
(2, 'Tonsilitis akut', 'Amoxicillin 500mg 3x sehari, Paracetamol 500mg bila demam', 'Selesai', '2024-01-10', 'Perbaikan kondisi dalam 3 hari', 2),
(1, 'Kontrol rutin diabetes', 'Lanjutkan Metformin, pantau gula darah 2x sehari', 'Aktif', '2024-01-20', 'Gula darah puasa: 120 mg/dL', 2)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE users IS 'System users with authentication and authorization';
COMMENT ON TABLE patients IS 'Patient personal information and medical history';
COMMENT ON TABLE medical_records IS 'Medical records including diagnosis and prescriptions';
COMMENT ON TABLE audit_logs IS 'Audit trail for all database operations';

