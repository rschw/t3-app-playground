import { NextPage } from "next";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import RoomEstimates from "../../components/room-estimates";
import ShareRoom from "../../components/share-room";
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
      <main className="container mx-auto flex flex-col gap-10">
        <ShareRoom roomId={roomId} />
        <SubmitEstimate roomId={roomId} />
        <RoomEstimates roomId={roomId} />
        <Toaster />
      </main>
    </>
  );
};

export default RoomPage;
