import prisma from 'prisma/prisma.js';

import { env } from '@/config/env.js';
import { genPassword, genUuid } from '@/utils/cryptoTools.js';
import { decodeToken, genBothTokens } from '@/utils/jwtTokens.js';
import { getUserByEmail } from '@/api/users/user.service.js';
import { ErrorHandler } from '@/utils/ErrorHandler.js';
import * as fileController from '@/utils/useFileController.js';

const genAndUpdateUserTokens = async (uuid: string) => {
  const payload = { sub: uuid };
  const tokens = await genBothTokens(payload);
  await prisma.user.update({
    where: {
      uuid
    },
    data: {
      refreshToken: tokens[env.REFRESH_TOKEN_NAME]
    }
  });
  return tokens;
};

export const registration = async (
  email: string,
  password: string,
  name: string,
  files: any
) => {
  const userUuid = genUuid();
  const payload = { sub: userUuid };
  const tokens = await genBothTokens(payload);

  const user = await prisma.$transaction(async (tx) => {
    const userData = await tx.user.create({
      data: {
        email,
        password: genPassword(password),
        name,
        uuid: userUuid,
        refreshToken: tokens[env.REFRESH_TOKEN_NAME]
      },
      select: {
        email: true,
        name: true,
        uuid: true,
        id: true
      }
    });

    const profileData = await tx.userProfile.create({
      data: {
        userId: userData.id
      }
    });

    // DEPLOY: поменять на линукс filesystem
    if (files.avatar !== undefined) {
      const avatar = files.avatar[0];

      const checkMimeType = await tx.mimeTypes.findFirst({
        where: { fileType: 'image', type: avatar.mimetype }
      });
      if (checkMimeType === null) {
        return await Promise.reject(
          ErrorHandler.BadRequestError({
            client: ['Запрещенный тип аватарки']
          })
        );
      }

      const createdFile = await tx.userProfileFiles.create({
        data: {
          userProfileId: profileData.id,
          isProfileAvatar: true,
          name: avatar.originalname,
          mimetype: avatar.mimetype,
          size: avatar.size
        },
        select: {
          id: true
        }
      });

      const foldersPath =
        env.DST_FILES_PATH + `\\users\\${userData.id}\\profile\\avatar`;

      await fileController.writeFile({
        dirPath: foldersPath,
        fileName: createdFile.id,
        content: avatar.buffer
      });
    }

    return userData;
  });

  return { ...tokens, ...user };
};

export const login = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (user === null) {
    ErrorHandler.UnauthorizedError({
      server: 'Такого аккаунта не существует',
      client: 'Такого аккаунта не существует'
    });
    return;
  }
  if (user?.password !== genPassword(password)) {
    ErrorHandler.BadRequestError({
      client: 'Неверный пароль',
      server: 'Неверный пароль'
    });
    return;
  }

  const authUserData = {
    email: user.email,
    name: user.name,
    uuid: user.uuid,
    id: user.id
  };

  const tokens = await genAndUpdateUserTokens(user.uuid);
  return { ...tokens, ...authUserData };
};

export const logout = async (refresh: string) => {
  try {
    const user = await prisma.user.update({
      where: {
        refreshToken: refresh
      },
      data: { refreshToken: null },
      select: {
        id: true,
        email: true
      }
    });
    return user;
  } catch (error) {
    return error;
  }
};

export const refresh = async (refresh: string) => {
  const decodedToken = decodeToken(refresh);

  const user = await prisma.user.findUnique({
    where: {
      uuid: decodedToken?.sub as string
    }
  });
  if (user === null) {
    ErrorHandler.UnauthorizedError({
      server: 'Такого аккаунта не существует',
      client: 'Такого аккаунта не существует'
    });
    return;
  }
  const tokens = await genAndUpdateUserTokens(user.uuid);
  return tokens;
};
