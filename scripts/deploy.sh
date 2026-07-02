#!/bin/bash
# Ubuntu 24.04 One-Click Deploy Script for Algorithm Blog
#
# Usage:
#   chmod +x deploy.sh
#   sudo ./deploy.sh                 # Full setup (first time)
#   sudo ./deploy.sh --update        # Update only files (subsequent)

set -euo pipefail

# Configuration — edit these before first run
DOMAIN="${DOMAIN:-ac.fccc.xyz}"
EMAIL="${EMAIL:-admin@fccc.xyz}"
SITE_DIR="/var/www/algoblog"
NGINX_CONF="/etc/nginx/sites-available/algoblog"
NGINX_ENABLED="/etc/nginx/sites-enabled/algoblog"

log() { echo "[$(date '+%H:%M:%S')] $*"; }

echo "=== Algorithm Blog Deploy Script ==="
echo "Domain: $DOMAIN"
echo "Site dir: $SITE_DIR"

# -----------------------------------------------
# Update mode (skip system setup)
# -----------------------------------------------
if [ "${1:-}" = "--update" ]; then
    log "[Mode] Update only — copying files to $SITE_DIR"
    mkdir -p "$SITE_DIR"
    rsync -av --delete ./dist/ "$SITE_DIR/"
    log "Update complete. Reloading Nginx..."
    sudo systemctl reload nginx
    log "Done!"
    exit 0
fi

# -----------------------------------------------
# Full setup mode
# -----------------------------------------------

# Step 1: Create site directory
log "[1/6] Creating site directory..."
sudo mkdir -p "$SITE_DIR"
sudo chown -R "$USER:$USER" "$SITE_DIR"

# Step 2: Copy built files
log "[2/6] Copying built files..."
if [ -d "./dist" ]; then
    cp -r ./dist/* "$SITE_DIR/"
else
    log "WARNING: ./dist directory not found. Create placeholder."
    echo "<h1>Site under construction</h1>" | sudo tee "$SITE_DIR/index.html" > /dev/null
fi

# Step 3: Nginx configuration
log "[3/6] Writing Nginx configuration..."

sudo tee "$NGINX_CONF" > /dev/null << 'NGINX'
server {
    listen 80;
    server_name _;
    root /var/www/algoblog;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1000;
    gzip_comp_level 6;
    gzip_vary on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # HTML files: no-cache
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # Sitemap
    location = /sitemap.xml {
        expires 1d;
    }

    # 404 fallback
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
NGINX

# Enable site
sudo ln -sf "$NGINX_CONF" "$NGINX_ENABLED"
sudo rm -f /etc/nginx/sites-enabled/default

# Step 4: Test Nginx config
log "[4/6] Testing Nginx configuration..."
sudo nginx -t

# Step 5: Reload Nginx
log "[5/6] Restarting Nginx..."
sudo systemctl restart nginx

# Step 6: SSL Certificate (Let's Encrypt)
log "[6/6] Setting up SSL with Let's Encrypt..."
if [ "$DOMAIN" != "algoblog.example.com" ]; then
    sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "$EMAIL"
    log "SSL certificate installed successfully!"
else
    log "SSL setup skipped. To enable HTTPS later:"
    log "  sudo certbot --nginx -d YOUR_DOMAIN --agree-tos --email YOUR_EMAIL"
fi

echo ""
echo "=== Deployment complete! ==="
if [ "$DOMAIN" != "algoblog.example.com" ]; then
    echo "Site: https://$DOMAIN"
else
    echo "Site: http://YOUR_SERVER_IP"
fi
echo "Site directory: $SITE_DIR"
echo "Nginx config: $NGINX_CONF"
