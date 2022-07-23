import Pusher from "pusher-js";
import { useState, useEffect } from "react";
import { trpc } from "../utils/trpc";
import { useUserId } from "../utils/user-id";
import RoomControls from "./room-controls";

const pusher_key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY!;
const pusher_host = process.env.NEXT_PUBLIC_PUSHER_APP_HOST!;
const pusher_port = parseInt(process.env.NEXT_PUBLIC_PUSHER_APP_PORT!);

const RoomEstimates: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { data, isLoading, refetch } = trpc.useQuery(["rooms.get-room-estimates", { roomId }]);

  const userId = useUserId();

  const [client] = useState(
    new Pusher(pusher_key, {
      wsHost: pusher_host,
      wsPort: pusher_port,
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

    const showEstimatesToggled = "show-estimates-toggled";
    function handleShowEstimatesToggled() {
      refetch();
    }

    console.log("subsribing to channel");
    const channel = client.subscribe(`room-${roomId}`);
    channel.bind(estimateSubmitted, handleEstimateSubmitted);
    channel.bind(estimatesDeleted, handleEstimatesDeleted);
    channel.bind(showEstimatesToggled, handleShowEstimatesToggled);

    return function cleanup() {
      console.log("cleaning up client");
      channel.unbind(estimateSubmitted, handleEstimateSubmitted);
      channel.unbind(estimatesDeleted, handleEstimatesDeleted);
      channel.unbind(showEstimatesToggled, handleShowEstimatesToggled);
      channel.disconnect();
    };
  }, [client, roomId, refetch]);

  if (isLoading) return null;

  return (
    <section className="flex flex-col gap-5">
      <h1 className="font-semibold text-lg">Results</h1>
      <RoomControls roomId={roomId} />
      <table className="table-auto w-full shadow shadow-violet-300">
        <thead className="bg-violet-500 text-white">
          <tr>
            <th className="border-b font-semibold p-4 text-left">Name</th>
            <th className="border-b font-semibold p-4 text-left">Story Points</th>
          </tr>
        </thead>
        <tbody>
          {data?.estimate.map((estimate) => (
            <tr key={estimate.id}>
              <td className="border-b border-violet-100 p-4">{estimate.userId}</td>
              <td className="border-b border-violet-100 p-4">
                {data.showEstimates ? estimate.value : "#"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default RoomEstimates;
