import { trpc } from "../utils/trpc";
import { FaUserMinus } from "react-icons/fa";
import toast from "react-hot-toast";

const RoomControls: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { mutateAsync } = trpc.useMutation(["rooms.delete-room-estimates"]);

  return (
    <section className="flex justify-between text-violet-500">
      <button>
        <FaUserMinus size={20} />
      </button>
      <button
        className="py-2 px-4 rounded shadow shadow-violet-300"
        onClick={() => {
          mutateAsync({ roomId })
            .catch(() => toast.error("Ups something went wrong"))
            .then(() => toast.success("Estimates deleted"));
        }}
      >
        Delete Estimates
      </button>
      <button className="py-2 px-4 rounded shadow shadow-violet-300">Show</button>
    </section>
  );
};

export default RoomControls;
