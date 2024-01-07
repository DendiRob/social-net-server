import { getUserByEmail } from '@/user/user.service.js';
import { genPassword } from '@/utils/cryptoTools.js';
import validator from 'express-validator';

const { body, cookie } = validator;

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

const loginGuard = [
  body('email')
    .notEmpty()
    .withMessage('Для регистрации необходим Email')
    .isEmail()
    .withMessage('Email не соответсвует формату')
    .bail()
    .custom(async (email: string) => {
      const user = await getUserByEmail(email);
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!user) {
        throw new Error('Пользователь с таким email не существует');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Требуется пароль')
    .bail()
    .custom(async (password: string, { req }) => {
      const email = req.body.email;

      if (typeof email !== 'string') {
        throw new Error('Проблемы с типами');
      }

      const user = await getUserByEmail(email);
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!user) {
        throw new Error('Пользователь с таким email не существует');
      }

      if (user?.password !== genPassword(password)) {
        throw new Error('Неверный пароль');
      }
    })
];

const logoutGuard = [
  cookie('refresh').notEmpty().withMessage('Вы не авторизованы')
];

const refreshGuard = [
  cookie('refresh').notEmpty().withMessage('Вы не авторизованы')
];

export { registerGuard, loginGuard, logoutGuard, refreshGuard };
