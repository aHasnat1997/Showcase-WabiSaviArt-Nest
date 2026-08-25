import type { Prisma } from '../../prisma/generated/prisma/client.js';

type AuthUser = Prisma.UserGetPayload<{
  include: { sellerProfile: { select: { id: true; shopName: true } } };
}>;

declare module 'express' {
  interface Request {
    user?: AuthUser;
  }
}
