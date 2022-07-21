import { useState } from "react";
import { trpc } from "../utils/trpc";
import { useUserId } from "../utils/user-id";

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

export default SubmitEstimate;
