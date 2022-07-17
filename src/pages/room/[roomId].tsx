import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

const SubmitEstimate: React.FC<{ roomId: string }> = ({ roomId }) => {
  const estimateOptions = ["?", "0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100"];

  const [estimate, setEstimate] = useState("");

  const { mutate } = trpc.useMutation(["rooms.submit-estimate"]);

  return (
    <section>
      <h1 className="font-semibold text-lg mb-4">Submit estimate</h1>
      <div className="grid grid-cols-6 gap-4">
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

const EstimateResults = () => {
  return (
    <section>
      <h1 className="font-semibold text-lg mb-4">Results</h1>
    </section>
  );
};

const RoomPage = () => {
  const { query } = useRouter();

  // since it is a static page the id does not exist on first render
  if (!query.roomId || typeof query.roomId !== "string") {
    return null;
  }

  return (
    <>
      <main className="my-20 container mx-auto flex flex-col gap-10">
        <SubmitEstimate roomId={query.roomId} />
        <EstimateResults />
      </main>
    </>
  );
};

export default RoomPage;
