declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      CLERK_SECRET_KEY: string;
      NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
      NEXT_PUBLIC_CLERK_SIGN_UP_URL: string;
      NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: string;
      NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: string;
      DATABASE_URL: string;
      NEXT_PUBLIC_CLOUD_NAME: string;
      NEXT_PUBLIC_API_KEY: string;
      NEXT_PUBLIC_API_SECRET: string;
      NEXT_PUBLIC_ENCRYPT_KEY: string;
      NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY: string;
      NEXT_PUBLIC_WEB_PUSH_PRIVATE_KEY: string;
      NEXT_PUBLIC_WEB_PUSH_EMAIL_TO: string;
    }
  }
}

export {}
