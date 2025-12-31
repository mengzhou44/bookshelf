interface Config {
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
  server: {
    port: number;
  };
}

const getConfig = (): Config => {
  return {
    db: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'bookshelf_user',
      password: process.env.DB_PASSWORD || 'bookshelf_password',
      name: process.env.DB_NAME || 'bookshelf',
    },
    server: {
      port: parseInt(process.env.PORT || '3001', 10),
    },
  };
};

export const config = getConfig();

