declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: string;
      URL: string;
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      JWT_EXPIRE_COOKIE: any;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
