#!/bin/bash

# Script untuk generate SSL certificates untuk development
# WARNING: Certificates ini adalah self-signed dan hanya untuk development!

set -e

echo "🔐 Generating SSL Certificates for Patient Data System"
echo "========================================================"

# Create ssl directory if it doesn't exist
mkdir -p ssl

cd ssl

# 1. Generate CA Private Key
echo ""
echo "1. Generating CA Private Key..."
openssl genrsa -out ca-key.pem 4096

# 2. Generate CA Certificate
echo ""
echo "2. Generating CA Certificate..."
openssl req -new -x509 -days 3650 -key ca-key.pem -out ca-cert.pem \
  -subj "/C=ID/ST=Jakarta/L=Jakarta/O=Hospital Dev/CN=Patient System CA"

# 3. Generate Database Server Certificate
echo ""
echo "3. Generating Database Server Certificate..."
openssl genrsa -out db-key.pem 4096
openssl req -new -key db-key.pem -out db.csr \
  -subj "/C=ID/ST=Jakarta/L=Jakarta/O= prodgCCCCC SaV gƒr Database Server/CN=database"
openssl x509 -req -days 365 -in db.csr -CA ca-cert.pem -CAkey ca-key.pem \
  -CAcreateserial -out db-cert.pem

# 4. Generate Backend Server Certificate
echo ""
echo "4. Generating Backend Server Certificate..."
openssl genrsa -out backend-key.pem 4096
openssl req -new -key backend-key.pem -out backend.csr \
  -subj "/C=ID/ST=Jakarta/L=Jakarta/O=Hospital Dev/CN=backend"
openssl x509 -req -days 365 -in backend.csr -CA ca-cert.pem -CAkey ca-key.pem \
  -CAcreateserial -out backend-cert.pem

# 5. Generate Frontend Server Certificate
echo ""
echo "5. Generating Frontend Server Certificate..."
openssl genrsa -out frontend-key.pem 4096
openssl req -new -key frontend-key.pem -out frontend.csr \
  -subj "/C=ID/ST=Jakarta/L=Jakarta/O=Hospital Dev/CN=localhost"
# Add subject alternative names for localhost
echo "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:::1" > frontend-ext.conf
openssl x509 -req -days 365 -in frontend.csr -CA ca-cert.pem -CAkey ca-key.pem \
  -CAcreateserial -out frontend-cert.pem -extfile frontend-ext.conf

# 6. Set appropriate permissions
echo ""
echo "6. Setting file permissions..."
chmod 600 ca-key.pem db-key.pem backend-key.pem frontend-key.pem
chmod 644 ca-cert.pem db-cert.pem backend-cert.pem frontend-cert.pem

# 7. Cleanup temporary files
echo ""
echo "7. Cleaning up temporary files..."
rm -f db.csr backend.csr frontend.csr frontend-ext.conf
rm -f ca-cert.srl

echo ""
echo "✅ SSL Certificates generated successfully!"
echo ""
echo "Generated files:"
echo "  - ca-cert.pem (Certificate Authority)"
echo "  - ca-key.pem (CA Private Key)"
echo "  - db-cert.pem, db-key.pem (Database)"
echo "  - backend-cert.pem, backend-key.pem (Backend)"
echo "  - frontend-cert.pem, frontend-key.pem (Frontend)"
echo ""
echo "⚠️  IMPORTANT: These are self-signed certificates for development only!"
echo "   For production, use certificates from a trusted CA."

cd ..

