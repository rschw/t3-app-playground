import { useRouter } from "next/router";
import { useState } from "react";
import { pusherClient } from "../../utils/pusher";
import { trpc } from "../../utils/trpc";

const SubmitEstimate: React.FC<{ roomId: string }> = ({ roomId }) => {
  const estimateOptions = ["?", "0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100"];

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
              mutate({ roomId, estimate: option });
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

const EstimateResults: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { data, isLoading, refetch } = trpc.useQuery(["rooms.get-room-estimates", { roomId }]);

  if (isLoading) return null;

  const channel = pusherClient.subscribe(`room-${roomId}`);
  channel.bind("estimate-submitted", (data: any) => {
    console.log(data);
    refetch();
  });

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
              <td className="border-b border-slate-100 p-4 pl-8">{estimate.user.name}</td>
              <td className="border-b border-slate-100 p-4 pl-8">{estimate.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

const RoomPage = () => {
  const { query } = useRouter();

  // since it is a static page the id does not exist on first render
  if (!query.roomId || typeof query.roomId !== "string") {
    return null;
  }

  const { roomId } = query;

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
