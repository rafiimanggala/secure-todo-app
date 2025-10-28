# Architecture Diagram

## System Architecture Overview

```text
┌──────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                │
│                                                                      │
│  Fully Encrypted Data Path                                           │
│  TLS 1.3 → HTTPS → PostgreSQL SSL                                   │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Container 1)                            │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ Nginx Reverse Proxy + HTTPS                            │         │
│  │ - Port 80: HTTP redirect to HTTPS                      │         │
│  │ - Port 443: HTTPS/TLS 1.3                              │         │
│  └────────────────────────────────────────────────────────┘         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ React SPA Application                                   │         │
│  │ - Authentication UI                                     │         │
│  │ - Dashboard with Statistics                             │         │
│  │ - Patient Management (CRUD)                             │         │
│  │ - Medical Records Management                            │         │
│  │ - User Management (Admin only)                          │         │
│  │ - Role-based UI (conditional rendering)                 │         │
│  └────────────────────────────────────────────────────────┘         │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ HTTPS/TLS 1.3
                               │ Bearer Token (JWT)
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     BACKEND (Container 2)                             │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ Express.js API Server                                   │         │
│  │ - Port 3000: HTTPS                                      │         │
│  │ - Helmet.js security headers                            │         │
│  │ - CORS protection                                       │         │
│  │ - Rate limiting                                         │         │
│  └────────────────────────────────────────────────────────┘         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ Authentication Layer                                    │         │
│  │ - JWT token generation & validation                     │         │
│  │ - bcrypt password hashing                               │         │
│  │ - Role extraction from token                            │         │
│  └────────────────────────────────────────────────────────┘         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ Authorization Middleware (RBAC)                         │         │
│  │ - authenticate() - verify JWT                           │         │
│  │ - authorize(...roles) - check permissions               │         │
│  │ - auditLog() - log all actions                          │         │
│  └────────────────────────────────────────────────────────┘         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ Business Logic Layer                                    │         │
│  │ - Controllers: auth, patients, medical-records, users   │         │
│  │ - Input validation                                      │         │
│  │ - Data encryption/decryption (AES-256)                  │         │
│  └────────────────────────────────────────────────────────┘         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ Data Access Layer                                       │         │
│  │ - Connection pool per role                              │         │
│  │ - Database user per role (admin_user, doctor_user,     │         │
│  │   nurse_user)                                           │         │
│  │ - Prepared statements                                   │         │
│  └────────────────────────────────────────────────────────┘         │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ PostgreSQL SSL
                               │ sslmode=require
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    DATABASE (Container 3)                             │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ PostgreSQL 15                                           │         │
│  │ - Port Identity5432                                     │         │
│  │ - SSL/TLS enabled                                       │         │
│  │ - ssl_cert_file: server.crt                            │         │
│  │ - ssl_key_file: server.key                             │         │
│  └────────────────────────────────────────────────────────┘         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ Database Users (RBAC at DB level)                       │         │
│  │                                                          │         │
│  │ admin_user:                                             │         │
│  │   - CONNECT on database                                 │         │
│  │   - ALL PRIVILEGES on all tables                        │         │
│  │                                                          │         │
│  │ doctor_user:                                            │         │
│  │   - CONNECT on database                                 │         │
│  │   - SELECT, INSERT, UPDATE on patients                  │         │
│  │   - SELECT, INSERT, UPDATE on medical_records           │         │
│  │   - SELECT on users (for attribution)                   │         │
│  │                                                          │         │
│  │ nurse_user:                                             │         │
│  │   - CONNECT on database                                 │         │
│  │   - SELECT on patients                                  │         │
│  │   - SELECT, UPDATE on medical_records                   │         │
│  │   - SELECT on users (for attribution)                   │         │
│  └────────────────────────────────────────────────────────┘         │
│                                                                      │
│  ┌────────────────────────────────────────────────────────┐         │
│  │ Database Schema                                         │         │
│  │                                                          │         │
│  │ users                    │  medical_records            │         │
│  │ downs ■ id               │  ■ id                       │         │
│  │ ■ username               │  ■ patient_id → patients.id │         │
│  │ ■ email                  │  ■ diagnosis                │         │
│  │ ■ password_hash          │  ■ resep                    │         │
│  │ ■ role                   │  ■ status                   │         │
│  │                          │  ■ tanggal_kunjungan        │         │
│  │ patients                 │  ■ catatan                  │         │
│  │ ■ id                     │  ■ created_by → users.id    │         │
│  │ ■ nama                   │                             │         │
│  │ ■ nik_encrypted          │  audit_logs                 │         │
│  │ ■ tanggal_lahir          │  ■ id                       │         │
│  │ ■ jenis_kelamin          │  ■ user_id → users.id       │         │
│  │ ■ alamat                 │  ■ action                   │         │
│  │ ■ telepon_encrypted      │  ■ table_name               │         │
│  │ ■ golongan_darah         │  ■ record_id                │         │
│  │ ■ riwayat_penyakit       │  ■ old_values (JSONB)       │         │
│  │ ■ status                 │  ■ new_values (JSONB)       │         │
│  │ ■ created_by → users.id  │  ■ timestamp                │         │
│  └────────────────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Authentication Flow

```text
1. User enters credentials in Login page
   ↓
2. Frontend sends POST /api/auth/login
   ↓
3. Backend validates credentials against database
   ↓
4. Backend generates JWT token with role info
   ↓
5. Token returned to frontend
   ↓
6. Frontend stores token in localStorage
   ↓
7. All subsequent requests include token in Authorization header
   ↓
8. Backend middleware validates token on each request
```

### Patient Data Access Flow

```text
1. Frontend requests: GET /api/patients?page=1&limit=10
   ↓
2. Request includes: Authorization: Bearer <JWT_TOKEN>
   ↓
3. Backend middleware authenticates JWT and extracts role
   ↓
4. Backend selects appropriate database connection pool based on role
   ↓
5. Database connection uses role-specific user (admin_user, doctor_user, nurse_user)
   ↓
6. PostgreSQL enforces permissions at database level
   ↓
7. Query executed with prepared statement
   ↓
8. Encrypted fields (NIK, phone) decrypted if needed
   ↓
9. Response sent to frontend
   ↓
10. Audit log entry created
```

### Security Layers

```text
┌─────────────────────────────────────────────────────┐
│ LAYER 1: Network Security                            │
│ - HTTPS/TLS 1.3 encryption                           │
│ - Self-signed certificates (dev) or CA certificates  │
│ - PostgreSQL SSL connection (sslmode=require)        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ LAYER 2: Authentication                              │
│ - JWT tokens with expiration                         │
│ - bcrypt password hashing (work factor 10)          │
│ - Secure token storage                               │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ LAYER 3: Authorization (RBAC)                        │
│ - Application-level role checking (middleware)       │
│ - Database-level user privileges                     │
│ - Conditional UI rendering                           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ LAYER 4: Data Protection                             │
│ - AES-256 encryption for sensitive data              │
│ - Prepared statements (SQL injection prevention)     │
│ - Input validation and sanitization                  │
│ - CORS and XSS protection                            │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ LAYER 5: Monitoring & Auditing                       │
│ - Request rate limiting                              │
│ - Audit logs for all operations                      │
│ - Health check endpoints                             │
│ - Error logging                                      │
└─────────────────────────────────────────────────────┘
```

## Container Communication

```text
Frontend Container (react:nginx)
├── Exposes: 80 (HTTP), 443 (HTTPS)
├── Volume mounts: SSL certificates
└── Network: patient_network

Backend Container (node:18)
├── Exposes: 3000 (HTTPS)
├── Volume mounts: SSL certificates, CA cert
├── Environment variables: DB credentials, JWT secret, encryption key
├── Network: patient_network
└── Depends on: database (health check)

Database Container (postgres:15-alpine)
├── Exposes: 5432 (PostgreSQL)
├── Volume mounts: SSL certificates, init scripts, data directory
├── Network: patient_network
└── Environment variables: DB admin credentials
```

## Network Topology

```text
Docker Network: patient_network (bridge)

┌──────────────────┐
│   Frontend       │
│   Port: 80/443   │
└────────┬─────────┘
         │
         │ (internal HTTPS)
         ▼
┌──────────────────┐
│    Backend       │
│   Port: 3000     │
└────────┬─────────┘
         │
         │ (PostgreSQL SSL)
         ▼
┌──────────────────┐
│   Database       │
│   Port: 5432     │
└──────────────────┘

External Access:
- Host Port 80 → Frontend Container 80
- Host Port 443 → Frontend Container 443
- Host Port 3000 → Backend Container 3000
- Host Port 5432 → Database Container 5432
```

