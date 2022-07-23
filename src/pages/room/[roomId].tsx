import { NextPage } from "next";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import RoomEstimates from "../../components/room-estimates";
import ShareRoom from "../../components/share-room";
import SubmitEstimate from "../../components/submit-estimate";
import { PusherProvider } from "../../utils/pusher";
import { useUserId } from "../../utils/user-id";

const RoomPage: NextPage = () => {
  const { query } = useRouter();
  const userId = useUserId();

  if (!query.roomId || typeof query.roomId !== "string") {
    return null;
  }

  const { roomId } = query;

  return (
    <>
      <main className="px-4 md:px-6 py-8 md:py-20 container mx-auto flex flex-col gap-8 md:gap-10">
        <PusherProvider userId={userId} roomId={roomId}>
          <ShareRoom roomId={roomId} />
          <SubmitEstimate roomId={roomId} />
          <RoomEstimates roomId={roomId} />
        </PusherProvider>
        <Toaster />
      </main>
    </>
  );
};

export default RoomPage;
