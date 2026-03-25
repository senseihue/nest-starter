import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { SEED_SUPERADMIN } from './seed.constants';

const prisma = new PrismaClient();
const PASSWORD_HASH_ROUNDS = 12;

async function main() {
  const passwordHash = await bcrypt.hash(SEED_SUPERADMIN.PASSWORD, PASSWORD_HASH_ROUNDS);

  await prisma.user.upsert({
    where: { email: SEED_SUPERADMIN.EMAIL },
    update: {
      name: SEED_SUPERADMIN.NAME,
      passwordHash,
      roles: [SEED_SUPERADMIN.ROLE],
    },
    create: {
      id: SEED_SUPERADMIN.ID,
      name: SEED_SUPERADMIN.NAME,
      email: SEED_SUPERADMIN.EMAIL,
      passwordHash,
      roles: [SEED_SUPERADMIN.ROLE],
    },
  });

  process.stdout.write(
    `Seeded superadmin: ${SEED_SUPERADMIN.EMAIL} role=${SEED_SUPERADMIN.ROLE}\n`,
  );
}

main()
  .catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
