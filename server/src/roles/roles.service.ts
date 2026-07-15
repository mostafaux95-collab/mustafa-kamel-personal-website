import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import type { Role } from '../../generated/prisma/client';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  // Read-only in Phase 1 — permissions are seeded (prisma/seed.ts), not
  // admin-editable yet. A future phase can add CRUD here once the admin
  // UI needs to manage custom roles/permissions.
  async getPermissionKeysForRole(role: Role): Promise<string[]> {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { role },
      include: { permission: true },
    });
    return rolePermissions.map((rp) => rp.permission.key);
  }

  listPermissions() {
    return this.prisma.permission.findMany({ orderBy: { key: 'asc' } });
  }

  listRolePermissions() {
    return this.prisma.rolePermission.findMany({ include: { permission: true } });
  }
}
