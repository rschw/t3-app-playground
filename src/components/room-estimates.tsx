import Pusher from "pusher-js";
import { useState, useEffect } from "react";
import { trpc } from "../utils/trpc";
import { useUserId } from "../utils/user-id";
import RoomControls from "./room-controls";

const pusher_key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY!;

const EstimateResults: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { data, isLoading, refetch } = trpc.useQuery(["rooms.get-room-estimates", { roomId }]);

  const userId = useUserId();

  const [client] = useState(
    new Pusher(pusher_key, {
      wsHost: "127.0.0.1",
      wsPort: 6001,
      forceTLS: false,
      enabledTransports: ["ws", "wss"],
      authEndpoint: "/api/pusher/auth-channel",
      auth: {
        headers: { user_id: userId }
      }
    })
  );

  useEffect(() => {
    const estimateSubmitted = "estimate-submitted";
    function handleEstimateSubmitted() {
      refetch();
    }

    const estimatesDeleted = "estimates-deleted";
    function handleEstimatesDeleted() {
      refetch();
    }

    const channel = client.subscribe(`room-${roomId}`);
    channel.bind(estimateSubmitted, handleEstimateSubmitted);
    channel.bind(estimatesDeleted, handleEstimatesDeleted);

    return function cleanup() {
      channel.unbind(estimateSubmitted, handleEstimateSubmitted);
      channel.unbind(estimatesDeleted, handleEstimatesDeleted);
      channel.disconnect();
    };
  }, [client, roomId, refetch]);

  if (isLoading) return null;

  return (
    <section>
      <h1 className="font-semibold text-lg mb-8">Results</h1>
      <RoomControls roomId={roomId} />
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="border-b font-medium p-4 text-left">Name</th>
            <th className="border-b font-medium p-4 text-left">Story Points</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((estimate) => (
            <tr key={estimate.id}>
              <td className="border-b border-slate-100 p-4">{estimate.userId}</td>
              <td className="border-b border-slate-100 p-4">{estimate.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default EstimateResults;
