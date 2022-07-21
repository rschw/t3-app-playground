import { NextPage } from "next";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useUserId } from "../../utils/user-id";

const SubmitEstimate: React.FC<{ roomId: string }> = ({ roomId }) => {
  const estimateOptions = ["?", "0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100"];

  const userId = useUserId();

  const [estimate, setEstimate] = useState("");

  const { mutate } = trpc.useMutation(["rooms.submit-estimate"]);

  return (
    <section>
      <h1 className="font-semibold text-lg mb-4">Submit estimate</h1>
      <div className="grid grid-cols-6 gap-8">
        {estimateOptions.map((option) => (
          <button
            key={option}
            className={`aspect-2/3 border border-violet-500 ${
              estimate === option ? "bg-violet-500 text-white" : ""
            } hover:bg-violet-500 hover:text-white rounded grid items-center justify-center text-5xl cursor-pointer`}
            onClick={() => {
              mutate({ userId, roomId, estimate: option });
              setEstimate(option);
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
};

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

const RoomPage: NextPage = () => {
  const { query } = useRouter();

  const { roomId } = query;

  // since it is a static page the id does not exist on first render
  if (!roomId || typeof roomId !== "string") {
    return null;
  }

  return (
    <>
      <main className="my-20 container mx-auto flex flex-col gap-10">
        <SubmitEstimate roomId={roomId} />
        <EstimateResults roomId={roomId} />
      </main>
    </>
  );
};

export default RoomPage;
