interface Config {
    db: {
        path: string;
    };
    server: {
        port: number;
    };
    env: string;
}

const getConfig = (): Config => {
    return {
        db: {
            path: process.env.DB_PATH || './data/bookshelf.db',
        },
        server: {
            port: parseInt(process.env.PORT || '3001', 10),
        },
        env: process.env.NODE_ENV || 'development',
    };
};

export const config = getConfig();

