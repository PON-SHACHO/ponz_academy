import { createAuthServer } from '@neondatabase/auth/next/server';

export const getAuth = () => {
  if (!process.env.NEON_AUTH_BASE_URL) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('NEON_AUTH_BASE_URL is not set. Deployment might fail or functionality might be limited.');
    }
    // Return a dummy object if missing to avoid immediate throws during build
    return {
      getSession: async () => ({ session: null, user: null }),
      // Add other necessary methods if they are called during build
    } as any;
  }
  return createAuthServer();
};

export const auth = getAuth();
