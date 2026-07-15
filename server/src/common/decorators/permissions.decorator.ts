import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

// Fine-grained, data-driven permission gate — e.g. @RequirePermissions('users:invite').
// Checked against the permission keys seeded onto the caller's role
// (see roles/roles.service.ts and prisma/seed.ts).
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
