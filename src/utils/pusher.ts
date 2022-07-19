import Pusher from "pusher-js";

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY!;

export const pusherClient = new Pusher(pusherKey, {
  wsHost: "127.0.0.1",
  wsPort: 6001,
  forceTLS: false,
  enabledTransports: ["ws", "wss"]
});
