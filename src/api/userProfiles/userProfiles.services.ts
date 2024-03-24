import prisma from 'prisma/prisma.js';

export const getProfile = async (userId: number) => {
  return await prisma.userProfile.findUnique({
    where: {
      userId
    },
    include: {
      userProfileFiles: {
        where: {
          isProfileAvatar: true
        }
      }
    }
  });
};

export const getFile = async (fileId: number) => {
  return await prisma.userProfileFiles.findUnique({
    where: {
      id: fileId
    },
    include: {
      userProfile: true
    }
  });
};
