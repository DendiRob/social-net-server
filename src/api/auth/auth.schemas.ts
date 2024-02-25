import * as yup from 'yup';

import { getUserByEmail } from '@/api/users/user.service.js';
import { genPassword } from '@/utils/cryptoTools.js';

export const listMimeTypes = yup.object({
  fileType: yup.string().max(20)
});

export const registerGuard = yup.object({
  email: yup
    .string()
    .email('Email не соответсвует формату')
    .required('Для регистрации необходим Email')
    .test(
      'isTheEmailUsed',
      'Пользователь с таким email уже существует',
      async (value) => {
        const user = await getUserByEmail(value);
        if (user !== null) return false;
        return true;
      }
    ),
  password: yup.string().required('Требуется пароль'),
  name: yup.string().required('Требуется указать ваше имя'),
  confPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Пароли не совпадают')
    .required()
});

export const loginGuard = yup.object({
  email: yup
    .string()
    .email('Email не соответсвует формату')
    .required('Для регистрации необходим Email')
    .test(
      'isTheEmailUsed',
      'Пользователь с таким email не существует',
      async (value) => {
        const user = await getUserByEmail(value);
        if (user === null) return false;
        return true;
      }
    ),
  password: yup
    .string()
    .required('Требуется пароль')
    .test('verifyPassword', 'Неверный пароль', async (password, context) => {
      const userEmail: string = context.parent.email;

      if (userEmail === undefined) return false;

      const user = await getUserByEmail(userEmail);

      if (user?.password !== genPassword(password)) return false;
      return true;
    })
});

export const refreshGuard = yup.object({
  refresh: yup.string().required('Вы не авторизованы')
});
