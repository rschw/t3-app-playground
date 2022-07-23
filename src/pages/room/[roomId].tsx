import { NextPage } from "next";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import RoomEstimates from "../../components/room-estimates";
import ShareRoom from "../../components/share-room";
import SubmitEstimate from "../../components/submit-estimate";

const RoomPage: NextPage = () => {
  const { query } = useRouter();
  if (!query.roomId || typeof query.roomId !== "string") {
    return null;
  }

  const { roomId } = query;

  return (
    <>
      <main className="px-4 md:px-6 py-8 md:py-20 container mx-auto flex flex-col gap-8 md:gap-10">
        <ShareRoom roomId={roomId} />
        <SubmitEstimate roomId={roomId} />
        <RoomEstimates roomId={roomId} />
        <Toaster />
      </main>
    </>
  );
};

export default RoomPage;
