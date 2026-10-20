# Servizio — Production Equipment Rental Marketplace Platform

Servizio is an enterprise-grade full-stack Equipment Rental Platform built for short-term rental of heavy construction machinery, 4K digital cinema gear, event sound systems, and industrial silent diesel generators.

---

## 🌟 Key Architecture & Features

### 1. Security & Authentication
- **Custom Backend Auth**: Node.js + Express + MongoDB with JWT access tokens (15m) & Refresh tokens (7d) in HTTP-only cookies with token rotation. No third-party Auth APIs (No Firebase, No Clerk, No Auth0).
- **Two-Step OTP Verification**: `TemporaryRegistration` model -> Email OTP (hashed + 10m TTL) -> Phone OTP (hashed + 10m TTL) -> Permanent `User` account creation.
- **Role-Based Authorization**: `USER` (Renter), `PROVIDER` (Equipment Owner), `ADMIN`, and `SUPER_ADMIN`.
- **Rate Limiting & Helmet Security**: Armed with express-rate-limit and Helmet security headers.

### 2. User KYC & Document Verification
- `UserDocument` model (Government ID, Address Proof, Selfie) uploaded securely to Cloudinary with Admin approval & rejection workflow.

### 3. Equipment Management & Condition Tracking
- Multi-image Cloudinary upload, condition history tracking (`EXCELLENT`, `GOOD`, `FAIR`, `DAMAGED`, `UNUSABLE`), and Admin approval status (`PENDING_APPROVAL`, `APPROVED`, `REJECTED`).

### 4. Booking Engine & Overlap Prevention
- Real-time double booking prevention query:
  ```javascript
  existingStart < requestedEnd && existingEnd > requestedStart
  ```
- Complete lifecycle tracking: Handover inspection, Active rental tracking, Return inspection, Damage Reporting (`DamageReport` model), and Admin Dispute Resolution.

### 5. Admin Console & Audit Log
- Platform analytics stats, KYC Document verification queue, Equipment listing approval queue, Damage dispute resolution, User suspension management, and immutable `AuditLog` records.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS 3, Redux Toolkit, Axios (auto-refresh token interceptor), React Hook Form, Lucide React icons.
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose), JWT, BcryptJS, Express Validator, Helmet, Cookie Parser.
- **Storage & Services**: Cloudinary (Multi-image & document storage), Nodemailer (Transactional email delivery).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas database URI

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/servizio.git
cd Servizio

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 3. Master Database Seeding
Populate Super Admin, Admin, Provider, User accounts, Equipment Categories, Approved Listings, and Sample Bookings:
```bash
cd backend
node scripts/seed_master_2026.js
```

**Seed Credentials**:
- **Super Admin**: `admin@example.com` | Password: `SuperAdmin@123`
- **Provider / Owner**: `provider@example.com` | Password: `Provider@123`
- **Renter User**: `user@example.com` | Password: `User@123`

### 4. Running Local Development Servers

Start Backend Server (Port 5024):
```bash
cd backend
npm run dev
```

Start Frontend Dev Server (Port 5173):
```bash
cd frontend
npm run dev
```

---

## 🐳 Docker Support

Run the full stack containerized using Docker Compose:
```bash
docker-compose up --build
```

---

## 📄 License
ISC License. Built for Servizio Equipment Rental Platform.
