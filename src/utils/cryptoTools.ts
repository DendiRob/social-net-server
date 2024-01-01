import crypto from 'crypto';

function genUuid() {
  return crypto.randomUUID();
}

function genPassword(password: string) {
  return crypto.createHmac('sha256', password).digest('hex');
}

export { genUuid, genPassword };
