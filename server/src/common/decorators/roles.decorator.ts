import { SetMetadata } from '@nestjs/common';
import type { Role } from '../../../generated/prisma/client';

export const ROLES_KEY = 'roles';

// Coarse-grained role gate. Prefer @RequirePermissions for most endpoints;
// use this only where the check is genuinely "this whole resource is
// Super-Admin-only" rather than a specific action.
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
