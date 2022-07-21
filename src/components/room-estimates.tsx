import Pusher from "pusher-js";
import { useState, useEffect } from "react";
import { trpc } from "../utils/trpc";

const pusher_key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY!;

const EstimateResults: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { data, isLoading, refetch } = trpc.useQuery(["rooms.get-room-estimates", { roomId }]);

  const [clientId] = useState(`random-user-id:${Math.random().toFixed(7)}`);

  const [client] = useState(
    new Pusher(pusher_key, {
      wsHost: "127.0.0.1",
      wsPort: 6001,
      forceTLS: false,
      enabledTransports: ["ws", "wss"],
      authEndpoint: "/api/pusher/auth-channel",
      auth: {
        headers: { user_id: clientId }
      }
    })
  );

  useEffect(() => {
    const eventName = "estimate-submitted";
    function handleEstimateSubmitted() {
      refetch();
    }

    console.log("subscribing to channel");
    const channel = client.subscribe(`room-${roomId}`);
    channel.bind(eventName, handleEstimateSubmitted);

    return function cleanup() {
      console.log("cleaning up channel");
      channel.unbind(eventName, handleEstimateSubmitted);
      channel.disconnect();
    };
  }, [client, roomId, refetch]);

  if (isLoading) return null;

  return (
    <section>
      <h1 className="font-semibold text-lg mb-8">Results</h1>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="border-b font-medium p-4 . pl-8 pt-0 pb-3 text-left">Name</th>
            <th className="border-b font-medium p-4 . pl-8 pt-0 pb-3 text-left">Story Points</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((estimate) => (
            <tr key={estimate.id}>
              <td className="border-b border-slate-100 p-4 pl-8">{estimate.userId}</td>
              <td className="border-b border-slate-100 p-4 pl-8">{estimate.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default EstimateResults;