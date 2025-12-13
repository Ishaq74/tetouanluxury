# External Services Integration Guide

This guide covers the setup and configuration of all external services required for production deployment.

## Table of Contents
1. [Database Setup](#database-setup)
2. [Authentication (Better Auth)](#authentication)
3. [Payment Processing (Stripe)](#payment-processing)
4. [Email Service (SendGrid)](#email-service)
5. [File Storage (Cloudinary)](#file-storage)
6. [Other Services](#other-services)

---

## Database Setup

### Local Development (Docker PostgreSQL)

1. **Start PostgreSQL with Docker Compose:**
```bash
docker-compose up -d
```

2. **Verify connection:**
```bash
docker-compose logs postgres
```

3. **Set environment variable:**
```bash
DATABASE_URL=postgresql://admin:password@localhost:5432/tetouanluxury
```

4. **Run migrations:**
```bash
npm run db:migrate
```

5. **Seed database (optional):**
```bash
npm run db:seed
```

### Production (NeonDB)

1. **Create NeonDB account:** https://neon.tech

2. **Create a new project:**
   - Name: tetouanluxury-production
   - Region: Choose closest to your users
   - PostgreSQL version: 16

3. **Get connection string:**
   - Go to Dashboard → Connection Details
   - Copy the connection string

4. **Set environment variable:**
```bash
NEON_DATABASE_URL=postgresql://username:password@ep-xxx-xxx.neon.tech/tetouanluxury
```

5. **Run production migrations:**
```bash
NODE_ENV=production npm run db:migrate
```

---

## Authentication

### Better Auth Setup

1. **Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

2. **Set environment variables:**
```bash
AUTH_SECRET=your-generated-secret
AUTH_URL=http://localhost:4321  # Production: https://yourdomain.com
```

### OAuth Providers (Optional)

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth Client ID
5. Application type: Web application
6. Authorized redirect URIs: `http://localhost:4321/api/auth/callback/google`
7. Copy Client ID and Client Secret

```bash
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

#### GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. New OAuth App
3. Homepage URL: `http://localhost:4321`
4. Authorization callback URL: `http://localhost:4321/api/auth/callback/github`
5. Copy Client ID and Client Secret

```bash
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
```

---

## Payment Processing

### Stripe Setup

1. **Create Stripe account:** https://stripe.com

2. **Get API keys:**
   - Dashboard → Developers → API keys
   - Copy Publishable key and Secret key

3. **Test mode keys (development):**
```bash
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

4. **Live mode keys (production):**
```bash
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

5. **Setup Webhook:**
   - Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/payments/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy Signing secret

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

6. **Test webhook locally (using Stripe CLI):**
```bash
stripe listen --forward-to localhost:4321/api/payments/webhook
```

---

## Email Service

### SendGrid Setup

1. **Create SendGrid account:** https://sendgrid.com

2. **Create API Key:**
   - Settings → API Keys → Create API Key
   - Name: tetouanluxury-production
   - Permissions: Full Access (or Mail Send only)
   - Copy the API key

3. **Set environment variables:**
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@tetouanluxury.com
```

4. **Verify sender identity:**
   - Settings → Sender Authentication
   - Verify domain or single sender email

5. **Test email sending:**
```bash
curl -X POST https://yourdomain.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com"}'
```

---

## File Storage

### Cloudinary Setup

1. **Create Cloudinary account:** https://cloudinary.com

2. **Get credentials:**
   - Dashboard → Account Details
   - Copy Cloud name, API Key, and API Secret

3. **Set environment variables:**
```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret
```

4. **Create upload presets (optional):**
   - Settings → Upload → Add upload preset
   - Name: tetouanluxury-villas
   - Signing Mode: Unsigned (for client-side uploads)

5. **Configure transformation:**
   - Settings → Image transformations
   - Create presets for different image sizes

---

## Other Services

### Google Maps API

1. **Go to** [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create API key
4. Restrict API key:
   - HTTP referrers: yourdomain.com
   - API restrictions: Maps JavaScript API

```bash
GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### WhatsApp Business API

1. **Sign up for** [WhatsApp Business API](https://business.whatsapp.com/)
2. Complete business verification
3. Get API credentials
4. Set webhook URL: `https://yourdomain.com/api/whatsapp/webhook`

```bash
WHATSAPP_API_KEY=your-api-key
WHATSAPP_PHONE_NUMBER=+212XXXXXXXXX
```

---

## Environment Variables Checklist

### Required for Development
- [ ] `DATABASE_URL` - Local PostgreSQL
- [ ] `AUTH_SECRET` - Generated secret
- [ ] `AUTH_URL` - http://localhost:4321

### Required for Production
- [ ] `NEON_DATABASE_URL` - NeonDB connection
- [ ] `AUTH_SECRET` - Same as development
- [ ] `AUTH_URL` - https://yourdomain.com
- [ ] `STRIPE_SECRET_KEY` - Live mode
- [ ] `STRIPE_PUBLIC_KEY` - Live mode
- [ ] `STRIPE_WEBHOOK_SECRET` - Production webhook
- [ ] `SENDGRID_API_KEY` - SendGrid API key
- [ ] `EMAIL_FROM` - Verified sender email

### Optional but Recommended
- [ ] `GOOGLE_CLIENT_ID` - OAuth
- [ ] `GITHUB_CLIENT_ID` - OAuth
- [ ] `CLOUDINARY_CLOUD_NAME` - File storage
- [ ] `CLOUDINARY_API_KEY` - File storage
- [ ] `CLOUDINARY_API_SECRET` - File storage
- [ ] `GOOGLE_MAPS_API_KEY` - Maps
- [ ] `WHATSAPP_API_KEY` - WhatsApp

---

## Testing the Integration

### 1. Test Database Connection
```bash
npm run db:studio
# Opens Drizzle Studio at http://localhost:4983
```

### 2. Test Authentication
```bash
# Sign up new user
curl -X POST http://localhost:4321/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Sign in
curl -X POST http://localhost:4321/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Test Stripe Payment
```bash
# Create payment intent
curl -X POST http://localhost:4321/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{"amount":1000,"currency":"eur"}'
```

### 4. Test Email
```bash
# Send test email (implement /api/test-email route)
curl -X POST http://localhost:4321/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com"}'
```

---

## Troubleshooting

### Database Connection Issues
- Verify Docker container is running: `docker ps`
- Check connection string format
- Ensure PostgreSQL is accessible on port 5432
- For NeonDB: Check IP allowlist and connection pooling

### Authentication Issues
- Verify AUTH_SECRET is set and matches in all environments
- Check AUTH_URL matches your domain
- Ensure database tables exist (run migrations)

### Stripe Webhook Issues
- Use Stripe CLI for local testing
- Verify webhook signing secret
- Check endpoint URL is publicly accessible
- Ensure webhook events are selected

### Email Sending Issues
- Verify SendGrid API key is valid
- Check sender email is verified
- Review SendGrid activity logs
- Check for rate limits

---

## Security Best Practices

1. **Never commit `.env` file to version control**
2. **Use different keys for development and production**
3. **Rotate secrets regularly**
4. **Use environment-specific webhook URLs**
5. **Enable two-factor authentication on all service accounts**
6. **Monitor API usage and set up alerts**
7. **Use restricted API keys where possible**
8. **Implement rate limiting on auth endpoints**
9. **Regularly backup database**
10. **Keep dependencies updated**

---

## Support Resources

- **Better Auth:** https://www.better-auth.com/docs
- **Drizzle ORM:** https://orm.drizzle.team/docs/overview
- **NeonDB:** https://neon.tech/docs
- **Stripe:** https://stripe.com/docs
- **SendGrid:** https://docs.sendgrid.com
- **Cloudinary:** https://cloudinary.com/documentation

---

For more information, see the main [README.md](../README.md) and [DEPLOYMENT.md](../DEPLOYMENT.md).
