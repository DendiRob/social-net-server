import { PrismaClient } from '@prisma/client';

console.log('Create prisma client...');

const prisma = new PrismaClient();

prisma.$on('query' as never, (e) => {
  console.log(`Query: ${(e as any).query}`);
  console.log(`Params: ${(e as any).params}`);
  console.log(`Duration: ${(e as any).duration} ms`);
});

export default prisma;
