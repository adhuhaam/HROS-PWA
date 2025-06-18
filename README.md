# HRoS - Human Resource Operating System

A modern, mobile-first employee self-service portal built with React, TypeScript, and Express.js. Features a native iOS-style design with glassmorphism effects, multi-language support, and comprehensive HR functionality.

## Features

- **Mobile-First Design**: Native iOS-style interface with glassmorphism effects
- **Multi-Language Support**: 6 languages (English, Sinhala, Tamil, Hindi, Malayalam, Bangla)
- **Employee Self-Service**: Dashboard, attendance tracking, leave management, payroll, documents
- **Progressive Web App (PWA)**: Offline capabilities and app-like experience
- **Real-time Updates**: Live attendance tracking and notifications
- **Dark/Light Mode**: Automatic theme switching with user preference storage

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query (React Query)
- **UI Components**: Radix UI, Heroicons
- **Deployment**: DigitalOcean App Platform

## Local Development

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hros-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/hros_db
   NODE_ENV=development
   SESSION_SECRET=your-super-secret-session-key
   PORT=5000
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb hros_db
   
   # Run migrations
   npm run db:migrate
   
   # Seed data (optional)
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## DigitalOcean Deployment Guide

### Method 1: DigitalOcean App Platform (Recommended)

#### Step 1: Prepare Your Repository

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Create a `app.yaml` file** in your project root:
   ```yaml
   name: hros-app
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/hros-app
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: SESSION_SECRET
       value: ${SESSION_SECRET}
     - key: DATABASE_URL
       value: ${DATABASE_URL}
     http_port: 5000

   databases:
   - name: hros-db
     engine: PG
     version: "14"
     size: db-s-1vcpu-1gb
   ```

3. **Update package.json scripts**:
   ```json
   {
     "scripts": {
       "start": "NODE_ENV=production tsx server/index.ts",
       "build": "npm run build:client && npm run build:server",
       "build:client": "vite build",
       "build:server": "tsc --project tsconfig.json",
       "dev": "NODE_ENV=development tsx server/index.ts",
       "db:migrate": "drizzle-kit push:pg"
     }
   }
   ```

#### Step 2: Deploy to DigitalOcean

1. **Create DigitalOcean Account**
   - Sign up at [digitalocean.com](https://digitalocean.com)
   - Add payment method

2. **Create New App**
   - Go to Apps section in DigitalOcean dashboard
   - Click "Create App"
   - Connect your Git repository
   - Select repository and branch

3. **Configure App Settings**
   - **App Name**: `hros-app`
   - **Region**: Choose closest to your users
   - **Plan**: Basic ($5/month for starter)

4. **Environment Variables**
   Add these environment variables in the App Platform dashboard:
   ```
   NODE_ENV=production
   SESSION_SECRET=your-super-secret-session-key-min-32-chars
   DATABASE_URL=${db.DATABASE_URL}
   ```

5. **Database Configuration**
   - Add PostgreSQL database component
   - Size: Basic ($15/month for starter)
   - The `DATABASE_URL` will be automatically generated

6. **Deploy**
   - Review configuration
   - Click "Create Resources"
   - Wait for deployment (5-10 minutes)

#### Step 3: Post-Deployment Setup

1. **Run Database Migrations**
   ```bash
   # Access app console via DigitalOcean dashboard
   npm run db:migrate
   ```

2. **Configure Domain (Optional)**
   - Go to Settings > Domains
   - Add custom domain
   - Update DNS records

### Method 2: DigitalOcean Droplet (Manual Setup)

#### Step 1: Create Droplet

1. **Create Ubuntu Droplet**
   - Size: Basic, 1 GB RAM, 1 vCPU ($6/month)
   - Region: Choose closest to users
   - Authentication: SSH Key (recommended)

2. **Connect to Droplet**
   ```bash
   ssh root@your-droplet-ip
   ```

#### Step 2: Server Setup

1. **Update System**
   ```bash
   apt update && apt upgrade -y
   ```

2. **Install Node.js 18**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt-get install -y nodejs
   ```

3. **Install PostgreSQL**
   ```bash
   apt install postgresql postgresql-contrib -y
   systemctl start postgresql
   systemctl enable postgresql
   ```

4. **Install Nginx**
   ```bash
   apt install nginx -y
   systemctl start nginx
   systemctl enable nginx
   ```

5. **Install PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   ```

#### Step 3: Database Setup

1. **Create Database User**
   ```bash
   sudo -u postgres psql
   ```
   ```sql
   CREATE USER hros_user WITH PASSWORD 'secure_password';
   CREATE DATABASE hros_db OWNER hros_user;
   GRANT ALL PRIVILEGES ON DATABASE hros_db TO hros_user;
   \q
   ```

2. **Configure PostgreSQL**
   ```bash
   # Edit postgresql.conf
   nano /etc/postgresql/14/main/postgresql.conf
   
   # Change:
   listen_addresses = 'localhost'
   
   # Edit pg_hba.conf
   nano /etc/postgresql/14/main/pg_hba.conf
   
   # Add:
   local   hros_db   hros_user   md5
   ```

3. **Restart PostgreSQL**
   ```bash
   systemctl restart postgresql
   ```

#### Step 4: Application Deployment

1. **Clone Repository**
   ```bash
   cd /var/www
   git clone <your-repo-url> hros-app
   cd hros-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment File**
   ```bash
   nano .env
   ```
   ```env
   DATABASE_URL=postgresql://hros_user:secure_password@localhost:5432/hros_db
   NODE_ENV=production
   SESSION_SECRET=your-super-secret-session-key-min-32-chars
   PORT=5000
   ```

4. **Build Application**
   ```bash
   npm run build
   ```

5. **Run Database Migrations**
   ```bash
   npm run db:migrate
   ```

6. **Start with PM2**
   ```bash
   pm2 start npm --name "hros-app" -- start
   pm2 save
   pm2 startup
   ```

#### Step 5: Nginx Configuration

1. **Create Nginx Config**
   ```bash
   nano /etc/nginx/sites-available/hros-app
   ```
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. **Enable Site**
   ```bash
   ln -s /etc/nginx/sites-available/hros-app /etc/nginx/sites-enabled/
   nginx -t
   systemctl reload nginx
   ```

#### Step 6: SSL Certificate (Let's Encrypt)

1. **Install Certbot**
   ```bash
   apt install certbot python3-certbot-nginx -y
   ```

2. **Get SSL Certificate**
   ```bash
   certbot --nginx -d your-domain.com
   ```

3. **Auto-renewal**
   ```bash
   crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `NODE_ENV` | Environment (development/production) | Yes | development |
| `SESSION_SECRET` | Session encryption key (min 32 chars) | Yes | - |
| `PORT` | Application port | No | 5000 |

## Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - Employee information
- `attendance` - Daily attendance records
- `leave_requests` - Leave applications
- `leave_balances` - Available leave balances
- `payroll` - Salary information
- `documents` - Employee documents

## API Endpoints

### Authentication
- `POST /api/auth/login` - Employee login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/user` - Get current user

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/employee/details` - Employee details
- `GET /api/notices` - Company notices
- `GET /api/holidays` - Upcoming holidays

### Attendance
- `GET /api/attendance/today` - Today's attendance
- `GET /api/attendance/records` - Attendance history
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out

### Leave Management
- `GET /api/leave/requests` - Leave requests
- `GET /api/leave/balances` - Leave balances
- `POST /api/leave/apply` - Apply for leave

### Payroll
- `GET /api/payroll` - Payroll history
- `GET /api/payroll/current` - Current month payroll

### Documents
- `GET /api/documents` - Employee documents
- `POST /api/documents/upload` - Upload document

## Security Features

- **Session-based Authentication**: Secure session management
- **CORS Protection**: Configured for production domains
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **Environment Variables**: Sensitive data protection

## Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Asset Optimization**: Vite build optimization
- **Database Indexing**: Optimized queries
- **Caching**: Browser and API response caching
- **Compression**: Gzip compression enabled

## Monitoring and Maintenance

### Application Logs
```bash
# PM2 logs
pm2 logs hros-app

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Database Backup
```bash
# Create backup
pg_dump -U hros_user -h localhost hros_db > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U hros_user -h localhost hros_db < backup_20241218.sql
```

### Application Updates
```bash
cd /var/www/hros-app
git pull origin main
npm install
npm run build
npm run db:migrate
pm2 restart hros-app
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check PostgreSQL status
   systemctl status postgresql
   
   # Check database credentials
   psql -U hros_user -h localhost hros_db
   ```

2. **Application Won't Start**
   ```bash
   # Check PM2 status
   pm2 status
   
   # Check application logs
   pm2 logs hros-app
   ```

3. **Nginx 502 Bad Gateway**
   ```bash
   # Check if app is running
   pm2 status
   
   # Check nginx configuration
   nginx -t
   ```

4. **SSL Certificate Issues**
   ```bash
   # Renew certificate
   certbot renew
   
   # Check certificate status
   certbot certificates
   ```

## Support

For issues and support:
- Check application logs for error details
- Verify environment variables are correctly set
- Ensure database is accessible and migrations are run
- Check firewall settings for port 80/443

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Note**: Replace placeholder values (your-domain.com, repository URLs, etc.) with your actual values before deployment.