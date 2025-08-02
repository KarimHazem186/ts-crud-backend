// types/env.d.ts

declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_URI?: string; // Optional string (you can make it required)
  }
}
