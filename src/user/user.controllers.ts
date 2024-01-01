import prisma from 'prisma/prisma.js';

export const getUserByUuid = async (uuid: string | undefined) => {
  if (uuid === undefined) return null;
  return await prisma.user.findUnique({
    where: {
      uuid
    }
  });
};
