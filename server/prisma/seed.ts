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

// Permission surface grows as each phase/module lands. Content permissions
// (e.g. "projects:*") follow one convention: Super Admin gets everything,
// Editor can read+write content but not manage users/settings, Viewer is
// read-only everywhere. Admin-only permissions (users/settings) stay
// Super-Admin-exclusive.
const CONTENT_ENTITIES = ['projects', 'testimonials', 'clients', 'services', 'skills', 'experience'];

const PERMISSIONS: { key: string; description: string }[] = [
  { key: 'users:invite', description: 'Invite new admin users' },
  { key: 'users:read', description: 'View other admin users' },
  { key: 'users:write', description: 'Edit or deactivate admin users' },
  { key: 'settings:manage', description: 'Manage site settings' },
  ...CONTENT_ENTITIES.flatMap((entity) => [
    { key: `${entity}:read`, description: `View ${entity}, including drafts` },
    { key: `${entity}:write`, description: `Create, edit, delete, or publish ${entity}` },
  ]),
];

const CONTENT_READ = CONTENT_ENTITIES.map((entity) => `${entity}:read`);
const CONTENT_WRITE = CONTENT_ENTITIES.map((entity) => `${entity}:write`);

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  [Role.SUPER_ADMIN]: PERMISSIONS.map((p) => p.key),
  [Role.EDITOR]: [...CONTENT_READ, ...CONTENT_WRITE],
  [Role.VIEWER]: [...CONTENT_READ],
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
