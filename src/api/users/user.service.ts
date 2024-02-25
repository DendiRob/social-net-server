// import type { User } from '@prisma/client';
import prisma from 'prisma/prisma.js';

export const getUserByUuid = async (uuid: string | undefined) => {
  if (uuid === undefined) return null;
  return await prisma.user.findUnique({
    where: {
      uuid
    }
  });
};

export const getUserByEmail = async (email: string | undefined) => {
  if (email !== undefined) {
    const user = await prisma.user.findFirst({
      where: {
        email
      }
    });
    return user;
  }
};

export const getViewer = async (uuid: string) => {
  return await prisma.user.findUnique({
    where: { uuid },
    select: {
      id: true,
      name: true,
      email: true,
      uuid: true
    }
  });
};
