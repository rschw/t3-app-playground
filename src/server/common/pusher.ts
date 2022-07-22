import Pusher from "pusher";
import { env } from "../env";

export const pusherServerClient = new Pusher({
  host: env.NEXT_PUBLIC_PUSHER_APP_HOST,
  // port: env.NEXT_PUBLIC_PUSHER_APP_PORT,
  useTLS: true,

  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET
});
