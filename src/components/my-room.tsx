import Link from "next/link";
import { trpc } from "../utils/trpc";
import { useUserId } from "../utils/user-id";

const MyRoom = () => {
  const userId = useUserId();

  const { data, isLoading, refetch } = trpc.useQuery(["rooms.get-my-room", { userId: userId }]);

  const { mutateAsync } = trpc.useMutation(["rooms.create-my-room"]);

  const handleCreateRoom = async () => {
    await mutateAsync({ userId });
    await refetch();
  };

  if (isLoading) return <div>Loading...</div>;

  if (!data)
    return (
      <div className="flex flex-col items-center text-center gap-4">
        <h1 className="text-3xl font-semibold">
          Set up your planning poker in seconds, start estimating story points in scrum poker now
        </h1>
        <p>Create your planning room and invite others with a single click</p>
        <button
          className="px-4 py-2 rounded bg-violet-500 text-white font-semibold uppercase"
          onClick={handleCreateRoom}
        >
          Create Instant Room
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center text-center gap-4">
      <h1 className="text-3xl font-semibold">A personal poker room has been assigned to you.</h1>
      <p>Share the room id with your team mates so they can join the scrum poker.</p>
      <div className="text-xl uppercase">YOUR ROOM ID: {data.id}</div>
      <Link href={`/room/${data.id}`}>
        <button className="px-4 py-2 rounded bg-violet-500 text-white font-semibold uppercase">
          Enter Your Room
        </button>
      </Link>
    </div>
  );
};

export default MyRoom;