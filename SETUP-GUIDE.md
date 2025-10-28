# Quick Setup Guide

## Prerequisites
- Docker and Docker Compose installed
- Ports 8080, 8443, 3000, and 5432 available

## Step-by-Step Setup

### 1. Generate SSL Certificates

```bash
./ssl/generate-certs.sh
```

### 2. Copy Certificates to Frontend

```bash
cp ssl/frontend-*.pem frontend/ssl/
cp ssl/ca-cert.pem frontend/ssl/
```

### 3. Start All Services

```bash
docker-compose up -d --build
```

### 4. Access the Application

Open your browser and go to:
- **HTTPS**: https://localhost:8443
- **HTTP** (redirects): http://localhost:8080

Accept the self-signed certificate warning when prompted.

### 5. Login with Default Credentials

**Admin:**
- Email: admin@hospital.com
- Password: Admin123!

**Doctor:**
- Email: dr.john@hospital.com
- Password: Dokter123!

**Nurse:**
- Email: nurse.jane@hospital.com
- Password: Perawat123!

## Port Mappings

- **Frontend**: http://localhost:8080 (redirects to HTTPS), https://localhost:8443
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

## Troubleshooting

### Check Service Status
```bash
docker-compose ps
```

### View Logs
```bash
docker-compose logs -f database
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Reset Everything
```bash
docker-compose down -v
docker-compose up -d --build
```

### Common Issues

**Container not starting:**
- Check logs: `docker-compose logs <service-name>`
- Ensure ports are not in use: `lsof -i :8080`

**Can't connect to database:**
- Check if database container is healthy: `docker-compose ps`
- Restart database: `docker-compose restart database`

**SSL certificate errors:**
- Accept the self-signed certificate in your browser
- Or regenerate certificates: `./ssl/generate-certs.sh`
