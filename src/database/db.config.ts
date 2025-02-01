import { registerAs } from '@nestjs/config';
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

export default registerAs('db', () => ({
  uri: `mongodb://${DB_HOST || 'localhost'}:${DB_PORT || 27017}/${DB_NAME || 'chat'}?authSource=admin`,
  user: DB_USERNAME || '',
  pass: DB_PASSWORD || '',
}));
