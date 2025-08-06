import { registerAs } from '@nestjs/config';

const {
  DB_PROTOCOL,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_AUTH_SOURCE,
} = process.env;

export default registerAs('db', () => {
  const protocol = DB_PROTOCOL || 'mongodb';
  const host = DB_HOST || 'localhost';
  const port = DB_PORT || '27017';
  const dbName = DB_NAME || 'chat';
  const username = DB_USERNAME || '';
  const password = DB_PASSWORD || '';
  const authSource = DB_AUTH_SOURCE || 'admin';

  const credentials = username ? `${username}:${password}@` : '';
  const isSrv = protocol === 'mongodb+srv';

  const uri = isSrv
    ? `${protocol}://${credentials}${host}/${dbName}`
    : `${protocol}://${credentials}${host}:${port}/${dbName}?authSource=${authSource}`;

  return {
    uri,
    user: username,
    pass: password,
  };
});
