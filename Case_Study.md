# Acme Marketplace — Multi-Vendor Handmade Goods Marketplace

## Executive Summary

Acme Marketplace is a full-stack, Etsy-style multi-vendor marketplace for handmade, vintage, and customized goods. Built as a solo client project, it features three distinct user roles (Buyer, Seller, Admin), a robust Stripe Connect payment infrastructure, and a real-time Socket.IO messaging layer.

## The Problem

The client needed a dedicated marketplace for independent artisans to sell directly to buyers, avoiding the aggressive commissions and rigid storefronts of generic third-party platforms. The platform needed to solve three specific challenges:
- **Seller Trust:** Buyers needed verification that sellers were legitimate makers, not drop-shippers.
- **Payment Distribution:** Complex multi-party transactions required precise fund routing, platform fee deduction, and administrative oversight.
- **Dispute Resolution:** Transactions required a structured audit trail for handling refunds and disputes securely.

---

## Impact & Contributions (XYZ Format)

As the sole full-stack developer, I owned the entire project lifecycle from database design to Docker container deployment. 

**Backend & Architecture**
- **Established strict domain boundaries and simplified data ownership for 40+ models** by architecting a PostgreSQL database split across 19 isolated schema namespaces using Prisma 7's multi-schema support.
- **Improved maintainability and scaled the API to 80+ endpoints** by implementing NestJS with 20+ feature modules, leveraging compiler-enforced separation of concerns over a loosely structured Express backend.
- **Streamlined API development and eliminated 90% of redundant pagination code** by engineering a reusable `@QueryBuilder()` decorator that automatically coerces URL parameters into Prisma query objects for sorting and filtering.

**Payments & Security**
- **Secured platform revenue and enabled reliable multi-party fund distribution** by integrating Stripe Connect Checkout Sessions and PaymentIntents, featuring admin-gated `stripe.transfers` that ensure a dispute window before seller payouts.
- **Prevented duplicate payment processing and database double-writes** by implementing robust idempotency checks in Stripe webhook handlers, seamlessly resolving race conditions between `checkout.session.completed` and `payment_intent.succeeded` events.
- **Eliminated complex client-side token refresh logic and improved session security** by deploying an `httpOnly` cookie-based JWT authentication system with silent token auto-renewal for both HTTP endpoints and WebSocket connections.

**Real-time & Infrastructure**
- **Reduced cloud dependency costs and ensured portable infrastructure** by integrating AWS SDK v3 with a self-hosted RustFS (S3-compatible) object store, implementing automatic bucket provisioning and public URL resolution without hardcoded database links.
- **Enhanced user engagement and facilitated seamless buyer-seller communication** by building a real-time Socket.IO chat system featuring room-based messaging, read receipts, and typing indicators, authenticated via a custom WebSocket JWT guard.
- **Achieved zero-downtime portability and simplified deployment** by containerizing the entire stack (NestJS, React, PostgreSQL, Redis, RustFS) with Docker Compose and deploying to a VPS via Dokploy.

---

## Technical Decisions Deep-Dive

### Discount Engine Layering
**Accomplished atomic and predictable checkout totals** by engineering a layered discount resolution engine (Product Discount → Active Promotion → Coupon Code → Free Shipping) executing within a single Prisma transaction.

### Unified WebSocket Authentication
**Secured real-time socket connections without duplicating authentication logic** by extending the NestJS `AuthGuard` to dynamically parse JWTs from HTTP cookies, WebSocket handshake headers, or `Authorization` headers based on the execution context.

### Dynamic Media URL Resolution
**Prevented Stripe Checkout rejections and maintained database portability** by developing a URL resolution service that dynamically translates relative S3 storage keys into fully qualified, URL-encoded HTTPS image links at runtime.

---

## Outcome
Delivered a production-ready marketplace covering the complete e-commerce lifecycle from cart to post-delivery dispute resolution. Handed off a fully documented integration contract (Postman collections, context docs) empowering the client's frontend team to successfully consume the API and launch the React admin dashboard.

---

## Tech Stack

| Layer          | Technologies                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------- |
| Frontend       | React, Refine, Ant Design, Recharts, Vite                                                    |
| Backend        | NestJS v11, TypeScript 5.7, Node.js (ESM)                                                    |
| Database       | PostgreSQL (multi-schema), Prisma v7, Redis                                                  |
| Infrastructure | Docker, Docker Compose, Dokploy, VPS, RustFS                                                 |
| Integrations   | Stripe Connect v22, AWS SDK v3 (S3), Socket.IO, Twilio, Nodemailer/Gmail SMTP, Google OAuth2 |
