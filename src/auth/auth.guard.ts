import { getUserByEmail } from '@/user/user.controllers.js';
import validator from 'express-validator';

const { body } = validator;

const registerGuard = [
  body('email')
    .notEmpty()
    .withMessage('Для регистрации необходим Email')
    .isEmail()
    .withMessage('Email не соответсвует формату')
    .bail()
    .custom(async (email: string) => {
      const user = await getUserByEmail(email);
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (user) {
        throw new Error('Пользователь с таким email уже существует');
      }
    }),
  body('password').notEmpty().withMessage('Требуется пароль'),
  body('name').notEmpty().withMessage('Требуется указать ваше имя')
];

export { registerGuard };
