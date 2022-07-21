import { NextPage } from "next";
import { useRouter } from "next/router";
import EstimateResults from "../../components/room-estimates";
import SubmitEstimate from "../../components/submit-estimate";

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
