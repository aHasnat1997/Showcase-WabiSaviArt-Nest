# Acme Marketplace — Multi-Vendor Handmade Goods Marketplace

> **Note:** This is a sanitized version of a production project — client-identifying details and secrets have been removed. Original project is live in production.

Acme Marketplace is a full-stack multi-vendor marketplace for handmade, vintage, and customized goods — an Etsy-style platform with three distinct user roles (Buyer, Seller, Admin), full Stripe Connect payment infrastructure, and a real-time messaging layer. 

Built as a robust production system, it spans a NestJS REST API with 20+ domain modules, a React admin dashboard, a PostgreSQL database split across 19 schema namespaces, and is containerized via Docker.

## Tech Stack

- **Backend:** NestJS, TypeScript, REST API (80+ endpoints)
- **Database:** PostgreSQL, Prisma ORM (Multi-schema setup)
- **Payments:** Stripe Connect (Checkout, PaymentIntents, Transfers)
- **Real-time:** Socket.IO for chat and notifications
- **Validation:** Zod (`nestjs-zod`)
- **Frontend (Admin):** React, Refine, Ant Design
- **Storage:** S3-compatible object storage (RustFS)
- **Deployment:** Docker, Docker Compose

## Hardest Technical Problems Solved

### 1. Stripe Connect with Admin-Gated Payouts
The payment flow uses Stripe Checkout Sessions and PaymentIntents. When a buyer pays, the money lands on the platform account. The webhook handler marks the order `paid` — but the seller doesn't receive funds immediately. An admin must explicitly approve the payout, at which point the API calls `stripe.transfers.create` with `source_transaction` pointing at the original charge, and the platform fee is deducted before the transfer. This gives the platform a dispute window before releasing funds. Webhook idempotency is handled gracefully to avoid duplicate processing.

### 2. Prisma Multi-Schema PostgreSQL Architecture
Rather than dumping 40+ models into a single schema, the database is split into 19 named PostgreSQL schemas — `user`, `order`, `payment`, `message`, `refund`, `dispute`, `coupon`, etc. This mirrors the domain boundaries in the API and makes it immediately clear which part of the system owns which data. Prisma's multi-schema support handles this cleanly, with a `base.prisma` entry point that pulls in all split schema files.

### 3. JWT in httpOnly Cookies + Token Auto-Renewal
JWTs are stored in `httpOnly; secure; sameSite=none` cookies — never in `localStorage`. The `AuthGuard` handles both HTTP and WebSocket contexts from a single implementation: for HTTP it extracts from the cookie or `Authorization` header; for WebSocket it parses the cookie from the raw handshake headers. If a token is expired but `stayLoggedIn` was set at login, the guard silently issues a new token and sends it back via both the cookie and an `X-Access-Token` response header, eliminating complex client-side refresh logic.

## Architecture

The system uses NestJS to enforce strict module boundaries per domain — `auth`, `order`, `stripe`, `chat`, `marketing`, etc. — each with its own controller, service, and DTOs. This ensures separation of concerns for complex marketplace mechanics like orders, refunds, disputes, coupons, promotions, payouts, and messaging.
