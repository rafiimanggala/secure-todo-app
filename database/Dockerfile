FROM postgres:15-alpine

# Copy configuration files
COPY postgresql.conf /etc/postgresql/postgresql.conf
COPY pg_hba.conf /etc/postgresql/pg_hba.conf

# Command to start PostgreSQL with SSL
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
