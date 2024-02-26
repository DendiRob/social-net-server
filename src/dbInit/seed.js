import { PrismaClient } from '@prisma/client';

import { mimeTypes } from './data/mimeTypes.js';

const prisma = new PrismaClient();

(async () => {
  await prisma.$transaction(async (tx) => {
    await createMimeTypes(mimeTypes, tx);
  });
})()
  .catch((error) => {
    console.log(error);
  })
  .finally(() => {
    process.exit();
  });

async function createMimeTypes(mimeTypes, tx) {
  await tx.mimeTypes.createMany({ data: mimeTypes });
}
