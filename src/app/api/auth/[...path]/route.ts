import { authApiHandler } from "@neondatabase/auth/next/server";

const getHandlers = () => {
  if (!process.env.NEON_AUTH_BASE_URL) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('NEON_AUTH_BASE_URL is missing. API Auth handlers will return 500.');
    }
    const handler = () => new Response("NEON_AUTH_BASE_URL is not configured", { status: 500 });
    return { GET: handler, POST: handler, PUT: handler, DELETE: handler, PATCH: handler };
  }
  return authApiHandler();
};

export const { GET, POST, PUT, DELETE, PATCH } = getHandlers();
