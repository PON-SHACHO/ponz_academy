import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: "Ponz Academy API",
    description: "WordPress-compatible REST API for article management",
    url: "https://ponz-academy.vercel.app",
    home: "https://ponz-academy.vercel.app",
    namespaces: ["wp/v2"],
    authentication: {
      "basic": {
        "description": "Basic Authentication (Username + Application Password)"
      }
    },
    routes: {
      "/wp/v2/posts": {
        "methods": ["GET", "POST"]
      },
      "/wp/v2/categories": {
        "methods": ["GET"]
      }
    }
  });
}
