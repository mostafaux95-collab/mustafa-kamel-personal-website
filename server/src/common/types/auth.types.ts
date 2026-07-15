import type { Role } from '../../../generated/prisma/client';

// Shape of the decoded access-token payload, attached to `request.user`
// by JwtAccessStrategy after verification.
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  permissions: string[];
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
}
