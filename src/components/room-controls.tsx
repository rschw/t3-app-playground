import { trpc } from "../utils/trpc";

const RoomControls: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { mutate } = trpc.useMutation(["rooms.delete-room-estimates"]);

  return (
    <section className="flex justify-between">
      <button className="py-2 px-4 border border-violet-500 rounded">Remove all users</button>
      <button
        className="py-2 px-4 border border-violet-500 rounded"
        onClick={() => mutate({ roomId })}
      >
        Delete Estimates
      </button>
      <button className="py-2 px-4 border border-violet-500 rounded">Show Estimates</button>
    </section>
  );
};

export default RoomControls;
