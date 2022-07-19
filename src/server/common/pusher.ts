import Pusher from "pusher";
import { env } from "../env";

export const pusherServerClient = new Pusher({
  host: "localhost",
  port: "6001",

  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET
});
