import Pusher, { Channel, PresenceChannel } from "pusher-js";
import vanillaCreate, { StoreApi } from "zustand/vanilla";
import createContext from "zustand/context";
import { useEffect, useState } from "react";
import React from "react";

const pusher_key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY!;
const pusher_server_host = process.env.NEXT_PUBLIC_PUSHER_SERVER_HOST!;
const pusher_server_port = parseInt(process.env.NEXT_PUBLIC_PUSHER_SERVER_PORT!, 10);
const pusher_server_tls = process.env.NEXT_PUBLIC_PUSHER_SERVER_TLS === "true";
const pusher_server_cluster = process.env.NEXT_PUBLIC_PUSHER_SERVER_CLUSTER!;

interface PusherZustandStore {
  pusherClient: Pusher;
  channel: Channel;
  presenceChannel: PresenceChannel;
  members: Map<string, any>;
}

/**
 * Section 1: "The Store"
 *
 * This defines a Pusher client and channel connection as a vanilla Zustand store.
 */
const createPusherStore = (userId: string, roomId: string) => {
  let pusherClient: Pusher;
  if (Pusher.instances.length) {
    pusherClient = Pusher.instances[0] as Pusher;
    pusherClient.connect();
  } else {
    pusherClient = new Pusher(pusher_key, {
      wsHost: pusher_server_host,
      wsPort: pusher_server_port,
      enabledTransports: pusher_server_tls ? ["ws", "wss"] : ["ws"],
      forceTLS: pusher_server_tls,
      cluster: pusher_server_cluster,
      disableStats: true,
      authEndpoint: "/api/pusher/auth-channel",
      auth: {
        headers: { user_id: userId }
      }
    });
  }

  const channel = pusherClient.subscribe(`room-${roomId}`);

  const presenceChannel = pusherClient.subscribe(`presence-${roomId}`) as PresenceChannel;

  const store = vanillaCreate<PusherZustandStore>(() => {
    return {
      pusherClient,
      channel,
      presenceChannel,
      members: new Map()
    };
  });

  const updateMembers = () => {
    store.setState(() => ({
      members: new Map(Object.entries(presenceChannel.members.members))
    }));
  };

  presenceChannel.bind("pusher:subscription_succeeded", updateMembers);
  presenceChannel.bind("pusher:member_added", updateMembers);
  presenceChannel.bind("pusher:member_removed", updateMembers);

  return store;
};

/**
 * Section 2: "The Context Provider"
 *
 * This creates a "Zustand React Context" that we can provide in the component tree.
 */
const { Provider: PusherZustandStoreProvider, useStore: usePusherZustandStore } =
  createContext<StoreApi<PusherZustandStore>>();

export const PusherProvider: React.FC<
  React.PropsWithChildren<{ roomId: string; userId: string }>
> = ({ roomId, userId, children }) => {
  const [store, updateStore] = useState<ReturnType<typeof createPusherStore>>();

  useEffect(() => {
    const newStore = createPusherStore(userId, roomId);
    updateStore(newStore);
    return () => {
      const pusher = newStore.getState().pusherClient;
      console.log("disconnecting pusher and destroying store", pusher);
      console.log("Expect a warning in terminal after this, React Dev Mode and all");
      pusher.disconnect();
      newStore.destroy();
    };
  }, [roomId, userId]);

  if (!store) return null;

  return (
    <PusherZustandStoreProvider createStore={() => store}>{children}</PusherZustandStoreProvider>
  );
};

/**
 * Section 3: "The Hooks"
 *
 * The exported hooks you use to interact with this store (in this case just an event sub)
 */
export function useSubscribeToEvent<MessageType>(
  eventName: string,
  callback: (data: MessageType) => void
) {
  const channel = usePusherZustandStore((state) => state.channel);

  const stableCallback = React.useRef(callback);

  // Keep callback sync'd
  React.useEffect(() => {
    stableCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const reference = (data: MessageType) => {
      stableCallback.current(data);
    };
    channel.bind(eventName, reference);
    return () => {
      channel.unbind(eventName, reference);
    };
  }, [channel, eventName]);
}

export const useCurrentMemberIds = () => usePusherZustandStore((s) => Array.from(s.members.keys()));
