import { useSubscribeToEvent } from "../utils/pusher";
import { trpc } from "../utils/trpc";
import RoomControls from "./room-controls";

const RoomEstimates: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { data, isLoading, refetch } = trpc.useQuery(["rooms.get-room-estimates", { roomId }]);

  useSubscribeToEvent("estimate-submitted", () => refetch());
  useSubscribeToEvent("estimates-deleted", () => refetch());
  useSubscribeToEvent("show-estimates-toggled", () => refetch());

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
