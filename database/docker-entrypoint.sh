#!/bin/bash
set -e

# Only copy SSL certificates if they exist and PGDATA is set
if [ -n "$PGDATA" ] && [ -f "/var/lib/postgresql/server-cert.pem" ] && [ ! -d "$PGDATA" ]; then
    echo "📋 Copying SSL certificates..."
    mkdir -p "$PGDATA/ssl"
    cp /var/lib/postgresql/server-cert.pem "$PGDATA/ssl/server.crt"
    cp /var/lib/postgresql/server-key.pem "$PGDATA/ssl/server.key"
    chmod 600 "$PGDATA/ssl/server.key"
fi

# Run default PostgreSQL entrypoint
exec /usr/local/bin/docker-entrypoint.sh "$@"

