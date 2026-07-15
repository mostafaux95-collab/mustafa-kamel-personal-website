import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set — check server/.env');
}
const prisma = new PrismaClient({ adapter: new PrismaPg(databaseUrl) });
const BCRYPT_ROUNDS = 12;

// Phase 1's full permission surface. Later phases add their own keys here
// (e.g. "projects:write") as each content module lands — this list is not
// meant to be exhaustive forever, just accurate for what Phase 1 gates.
const PERMISSIONS: { key: string; description: string }[] = [
  { key: 'users:invite', description: 'Invite new admin users' },
  { key: 'users:read', description: 'View other admin users' },
  { key: 'users:write', description: 'Edit or deactivate admin users' },
  { key: 'settings:manage', description: 'Manage site settings' },
];

// Super Admin gets everything; Editor/Viewer start with nothing in Phase 1
// (no content modules exist yet to grant access to) and gain permissions
// as later phases seed their own keys.
const ROLE_PERMISSIONS: Record<Role, string[]> = {
  [Role.SUPER_ADMIN]: PERMISSIONS.map((p) => p.key),
  [Role.EDITOR]: [],
  [Role.VIEWER]: [],
};

async function seedPermissions() {
  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      create: permission,
      update: { description: permission.description },
    });
  }

  for (const role of Object.values(Role)) {
    const keys = ROLE_PERMISSIONS[role];
    for (const key of keys) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key } });
      await prisma.rolePermission.upsert({
        where: { role_permissionId: { role, permissionId: permission.id } },
        create: { role, permissionId: permission.id },
        update: {},
      });
    }
  }

  console.log(`Seeded ${PERMISSIONS.length} permissions across ${Object.values(Role).length} roles.`);
}

async function seedSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const firstName = process.env.SUPER_ADMIN_FIRST_NAME ?? 'Super';
  const lastName = process.env.SUPER_ADMIN_LAST_NAME ?? 'Admin';

  if (!email) {
    throw new Error('SUPER_ADMIN_EMAIL is not set — check server/.env');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Super Admin ${email} already exists — skipping.`);
    return;
  }

  const password = randomBytes(12).toString('base64url');
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      passwordHash,
      role: Role.SUPER_ADMIN,
      isActive: true,
      isEmailVerified: true,
    },
  });

  console.log('\n================ SUPER ADMIN CREATED ================');
  console.log(`  email:    ${email}`);
  console.log(`  password: ${password}`);
  console.log('  (dev-only — change this after your first login)');
  console.log('=======================================================\n');
}

async function main() {
  await seedPermissions();
  await seedSuperAdmin();
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
