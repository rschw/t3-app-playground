import Pusher from "pusher";
import { env } from "../env";

export const pusherServerClient = new Pusher({
  appId: env.PUSHER_APP_ID,
  secret: env.PUSHER_APP_SECRET,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
  host: env.NEXT_PUBLIC_PUSHER_SERVER_HOST,
  port: env.NEXT_PUBLIC_PUSHER_SERVER_PORT,
  useTLS: env.NEXT_PUBLIC_PUSHER_SERVER_TLS === "true",
  cluster: env.NEXT_PUBLIC_PUSHER_SERVER_CLUSTER
});
