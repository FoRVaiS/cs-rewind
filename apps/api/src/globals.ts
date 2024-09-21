import ExpressSession from 'express-session';
import ConnectPgSimple from 'connect-pg-simple';

import { raise } from '@rewind/express-api/utils';

const pgSession = ConnectPgSimple(ExpressSession);

export function createSessionStore(connectionString: string, tableName = 'session') {
  if (!connectionString.startsWith('postgresql://')) raise('The session connection string must be a valid postgresql protocol');

  return new pgSession({
    conString: connectionString,
    tableName,
    createTableIfMissing: true,
  });
}
