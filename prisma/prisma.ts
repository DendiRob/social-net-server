import { PrismaClient } from '@prisma/client';

console.log('Create prisma client...');

const SHOW_LOGS = false;

const prisma = new PrismaClient({
  log: SHOW_LOGS
    ? [
        {
          emit: 'event',
          level: 'query'
        },
        {
          emit: 'stdout',
          level: 'error'
        },
        {
          emit: 'stdout',
          level: 'info'
        },
        {
          emit: 'stdout',
          level: 'warn'
        }
      ]
    : undefined
});

prisma.$on('query' as never, (e) => {
  console.log(`Query: ${(e as any).query}`);
  console.log(`Params: ${(e as any).params}`);
  console.log(`Duration: ${(e as any).duration} ms`);
});

export default prisma;
