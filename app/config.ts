export const database = {
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'test',
  logging: true,
  dialect: 'postgres',
  sync: {
    force: true,
  },
};

export const HOST = process.env.HOST || '0.0.0.0';
export const PORT = process.env.PORT || 5000;
