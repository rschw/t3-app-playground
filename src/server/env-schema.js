const { z } = require("zod");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),

  DATABASE_URL: z.string().url(),

  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),

  GITHUB_ID: z.string(),
  GITHUB_SECRET: z.string(),

  NEXT_PUBLIC_PUSHER_APP_KEY: z.string(),
  NEXT_PUBLIC_PUSHER_APP_HOST: z.string(),
  NEXT_PUBLIC_PUSHER_APP_PORT: z.string(),
  PUSHER_APP_ID: z.string(),
  PUSHER_APP_SECRET: z.string(),
  PUSHER_APP_CLUSTER: z.string()
});

module.exports.envSchema = envSchema;
