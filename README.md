

## Overview
This guide documents the complete process of configuring two secure websites hosted locally on Apache2 and Nginx servers. It includes subinterface creation, IP assignments, DNS resolution, TLS encryption, ModSecurity setup, OWASP Core Rule Set (CRS) integration, and vulnerability testing. By the end, your web servers will be protected against SQL Injection, XSS, and Command Injection attacks.

---

## 1. Network Configuration

### Subinterface Creation and IP Assignment
1. Create subinterfaces using `ip` commands.
    ```
    ifconfig
    sudo nmcli connection add type vlan con-name wlp2s010 dev wlp2s0 id 10
    sudo nmcli connection add type vlan con-name wlp2s020 dev wlp2s0 id 20
    sudo nmcli connection modify wlp2s010 ipv4.addresses "192.168.1.10/24" ipv4.method manual
    sudo nmcli connection up wlp2s010
    sudo nmcli connection modify wlp2s020 ipv4.addresses "192.168.1.20/24" ipv4.method manual
    sudo nmcli connection up wlp2s020
    ifconfig

    ```

2. Verify the configuration with:
    ```
    ip addr show
    ```
---

## 2. Web Server Setup

### Host Websites Locally
1. Install Apache2 and Nginx:
    ```
    sudo apt update && sudo apt install apache2 nginx -y
    ```

2. Configure Apache2:
    - Edit `/etc/apache2/sites-available/24673.auca.ac.rw`:
        ```
        <VirtualHost *:80>
            ServerName 24673.auca.ac.rw
            DocumentRoot /var/www/24673.auca.ac.rw
        </VirtualHost>
        ```
    - Enable site and restart Apache2:
        ```
        sudo a2ensite 24673.auca.ac.rw.conf
        sudo systemctl restart apache2
        ```

3. Configure Nginx:
    - Edit `/etc/nginx/sites-available/portfolio`:
        ```
        server {
            listen 80;
            server_name portfolio.auca.ac.rw;
            root /var/www/portfolio;
        }
        ```
    - Enable site and restart Nginx:
        ```
        sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
        sudo systemctl restart nginx
        ```

4. Add hostnames to `/etc/hosts`:
    ```
    192.168.1.10	24673.auca.ac.rw
    192.168.1.20	portfolio.auca.ac.rw

    ```

---

## 3. Enable HTTPS with Self-Signed Certificates

### Create Certificates
1. Generate certificates:
    ```
    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/24673.key -out /etc/ssl/certs/24673.crt
    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/portfolio.key -out /etc/ssl/certs/portfolio.crt
    sudo nano /etc/apache2/sites-available/24673.auca.ac.rw
    sudo a2enmod ssl
    sudo systemctl restart apache2.service
    sudo nano /etc/nginx/sites-available/portfolio.auca.ac.rw
    ```

2. Update server configurations for HTTPS.

   **Apache2**:
   ```
   <VirtualHost *:443>
       ServerName 24673.auca.ac.rw
       SSLEngine on
       SSLCertificateFile /etc/ssl/certs/server.crt
       SSLCertificateKeyFile /etc/ssl/private/server.key
   </VirtualHost>
   ```

   **Nginx**:
   ```
   server {
       listen 443 ssl;
       server_name portfolio.auca.ac.rw;
       ssl_certificate /etc/ssl/certs/server.crt;
       ssl_certificate_key /etc/ssl/private/server.key;
   }
   ```

3. Reload services:
    ```
    sudo systemctl reload apache2
    sudo systemctl reload nginx
    ```

---

## 4. ModSecurity and OWASP CRS Setup

### Install ModSecurity
1. Install dependencies:
    ```
    sudo git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx 
    cd ModSecurity
    sudo git submodule init
    sudo git submodule update
    sudo ./configure --add-dynamic-module=../ModSecurity-nginx --with-cc-opt='-g -O2 -fno-omit-frame-pointer -mno-omit-leaf-frame-pointer -ffile-prefix-map=/build/nginx-DlMnQR/nginx-1.24.0=. -flto=auto -ffat-lto-objects -fstack-protector-strong -fstack-clash-protection -Wformat -Werror=format-security -fcf-protection -fdebug-prefix-map=/build/nginx-DlMnQR/nginx-1.24.0=/usr/src/nginx-1.24.0-2ubuntu7.1 -fPIC -Wdate-time -D_FORTIFY_SOURCE=3' --with-ld-opt='-Wl,-Bsymbolic-functions -flto=auto -ffat-lto-objects -Wl,-z,relro -Wl,-z,now -fPIC' --prefix=/usr/share/nginx --conf-path=/etc/nginx/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=stderr --lock-path=/var/lock/nginx.lock --pid-path=/run/nginx.pid --modules-path=/usr/lib/nginx/modules --http-client-body-temp-path=/var/lib/nginx/body --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --http-proxy-temp-path=/var/lib/nginx/proxy --http-scgi-temp-path=/var/lib/nginx/scgi --http-uwsgi-temp-path=/var/lib/nginx/uwsgi --with-compat --with-debug --with-pcre-jit --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-http_auth_request_module --with-http_v2_module --with-http_dav_module --with-http_slice_module --with-threads --with-http_addition_module --with-http_flv_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_mp4_module --with-http_random_index_module --with-http_secure_link_module --with-http_sub_module --with-mail_ssl_module --with-stream_ssl_module --with-stream_ssl_preread_module --with-stream_realip_module --with-http_geoip_module=dynamic --with-http_image_filter_module=dynamic --with-http_perl_module=dynamic --with-http_xslt_module=dynamic --with-mail=dynamic --with-stream=dynamic --with-stream_geoip_module=dynamic
    cd /opt/ModSecurity
    sudo ./build.sh
    sudo make
    sudo make install

    
    ```

2. Enable ModSecurity in Apache2:
    ```
    sudo a2enmod security2
    sudo systemctl restart apache2
    ```

3. Configure Nginx for ModSecurity:
    ```
    load_module modules/ngx_http_modsecurity_module.so;
    ```

4. Enable ModSecurity:
    ```
    modsecurity on;
    modsecurity_rules_file /etc/nginx/modsec/main.conf;
    ```

### OWASP Core Rule Set (CRS) Configuration
1. Download CRS:
    ```
    git clone https://github.com/coreruleset/coreruleset.git /etc/nginx/modsec/crs
    ```

2. Link CRS files:
    ```
    cp /etc/nginx/modsec/crs/crs-setup.conf.example /etc/nginx/modsec/crs/crs-setup.conf
    cp /etc/nginx/modsec/crs/rules/*.conf /etc/nginx/modsec/rules/
    ```

3. Update ModSecurity configuration to include CRS:
    ```
    include /etc/nginx/modsec/crs/crs-setup.conf;
    include /etc/nginx/modsec/rules/*.conf;
    ```

---

## 5. Testing and Validating Security

### Vulnerability Testing
Use tools like `curl` or browsers to simulate attacks:

**SQL Injection**:
    ```
    curl -X POST 'http://24673.auca.ac.rw/create' -d "course=network'--&code=234"
    ```

**XSS**:
    ```
    curl 'http://portfolio.auca.ac.rw/?search=<script>alert("XSS")</script>'
    ```

**Command Injection**:
    ```
    curl 'http://portfolio.auca.ac.rw/?cmd=;ls'
    ```

### Analyze Logs
Inspect `/var/log/modsec_audit.log` for details:
    ```
    cat /var/log/modsec_audit.log
    ```

### Verify Blocked Requests
Ensure blocked requests meet anomaly thresholds configured in CRS:
    ```
    SecAction \
        "id:900110,\
        phase:1,\
        pass,\
        t:none,\
        nolog,\
        tag:'OWASP_CRS',\
        ver:'OWASP_CRS/4.10.0-dev',\
        setvar:tx.inbound_anomaly_score_threshold=5,\
        setvar:tx.outbound_anomaly_score_threshold=4"
    ```

---

## 6. Firewall Configuration

### Allow Necessary Ports
Enable HTTP, HTTPS, and SSH and so on:
    ```
    ufw app list
    sudo ufw app list
    sudo ufw allow apache OpenSSH
    sudo ufw allow Apache
    sudo ufw allow Apache Full
    sudo ufw allow 'Apache Full'
    sudo ufw allow 'Apache HTTP'
    sudo ufw allow 'Apache secure'
    sudo ufw allow CUPS
    sudo ufw allow 'Nginx Full'
    sudo ufw allow 'Nginx HTTPS'
    sudo ufw allow 'Nginx HTTP'
    sudo ufw allow OpenSSH
    sudo ufw allow 8000
    sudo ufw allow 3000
    sudo ufw enable
    ```

### Verify Status
    ```
    sudo ufw status
    ```

---

## Conclusion
Congratulations! You have successfully configured and secured your web servers with Apache2, Nginx, ModSecurity, and OWASP CRS. This guide showcases your journey of creating a robust web environment, thoroughly tested against common vulnerabilities. Consider sharing this experience as a blog post on platforms like **daily.dev**, **dev.to**, or as a comprehensive `README.md` on my GitHub.


# Traefik-Docker-implementation
# Traefik-Docker-implementation
# Traefik-Docker-implementation
