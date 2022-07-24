import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { trpc } from "../utils/trpc";
import { useUserId } from "../utils/user-id";

const SubmitEstimate: React.FC<{ roomId: string }> = ({ roomId }) => {
  const estimateValues = ["?", "0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100"];

  const userId = useUserId();
  const [estimateValue, setEstimateValue] = useState("");
  const { data } = trpc.useQuery(["rooms.get-room-estimates", { roomId }]);
  const { mutateAsync } = trpc.useMutation(["rooms.submit-estimate"]);

  const handleSubmitEstimate = (value: string) => {
    toast.promise(
      mutateAsync({ userId, roomId, value }),
      {
        loading: "Submitting estimate...",
        success: "Estimate submitted",
        error: (err) => `Oops something went wrong: ${err}`
      },
      { error: { duration: Infinity } }
    );
    setEstimateValue(value);
  };

  useEffect(() => {
    const estimate = data?.estimate.find(({ userId: id }) => id === userId);
    setEstimateValue(estimate?.value || "");
  }, [data, userId]);

  return (
    <section className="flex flex-col gap-5">
      <h1 className="font-semibold text-lg">Submit estimate</h1>
      <div className="grid grid-cols-5 md:grid-cols-6 gap-2 md:gap-4">
        {estimateValues.map((value) => (
          <button
            key={value}
            className={`aspect-2/3 border border-violet-500 ${
              estimateValue === value ? "bg-violet-500 text-white" : ""
            } hover:bg-violet-500 hover:text-white rounded grid items-center content-center justify-center text-xl md:text-5xl cursor-pointer`}
            onClick={() => handleSubmitEstimate(value)}
          >
            {value}
          </button>
        ))}
      </div>
    </section>
  );
};

export default SubmitEstimate;
