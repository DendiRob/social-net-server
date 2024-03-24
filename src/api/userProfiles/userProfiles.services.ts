import prisma from 'prisma/prisma.js';

export const getProfile = async (userId: number) => {
  return await prisma.userProfile.findUnique({
    where: {
      userId
    },
    include: {
      userProfileFiles: true
    }
  });
};
