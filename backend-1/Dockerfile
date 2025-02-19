# Backend 1 Dockerfile
FROM python:3.12-alpine

# Prevent Python from writing bytecode and buffer output
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Copy project files
COPY . .

# Create virtual environment and install dependencies
RUN python3 -m venv /opt/venv1 && \
    /opt/venv1/bin/pip install --no-cache-dir --upgrade pip && \
    /opt/venv1/bin/pip install --no-cache-dir -r requirements.txt

# Create entrypoint script
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'set -e' >> /entrypoint.sh && \
    echo '/opt/venv1/bin/python manage.py makemigrations --noinput' >> /entrypoint.sh && \
    echo '/opt/venv1/bin/python manage.py migrate --noinput' >> /entrypoint.sh && \
    echo '/opt/venv1/bin/python manage.py collectstatic --noinput' >> /entrypoint.sh && \
    echo 'exec "$@"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

# Entrypoint
ENTRYPOINT ["/entrypoint.sh"]