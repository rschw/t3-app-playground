import { NextPage } from "next";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { FaUser, FaUserMinus } from "react-icons/fa";
import ShareRoom from "../../components/ShareRoom";
import { PusherProvider, useSubscribeToEvent } from "../../utils/pusher";
import { trpc } from "../../utils/trpc";
import { useUser } from "../../utils/useUser";

const SubmitEstimate: React.FC<{ roomId: string }> = ({ roomId }) => {
  const estimates = ["?", "0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100"];
  const [user, setUser] = useUser();
  const { data } = trpc.proxy.rooms.getById.useQuery({ roomId });

  const getUserEstimate = () => data?.estimate.find((e) => e.userId === user.id)?.value;

  const { mutateAsync: submitEstimateAsync, isLoading: isSubmittingEstimate } =
    trpc.proxy.rooms.submitEstimate.useMutation();

  const handleSubmit = (value: string) => {
    if (!isSubmittingEstimate) {
      const { id: userId, name: userName } = user;
      toast.promise(submitEstimateAsync({ roomId, userId, userName, value }), {
        loading: "Submitting estimate..",
        success: `${value} story points submitted!`,
        error: "Oops, something went wrong!"
      });
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-semibold text-lg">Submit estimate</h1>
      <div className="grid grid-cols-6 gap-2 md:gap-4">
        {estimates.map((value) => (
          <button
            key={value}
            className={`aspect-2/3 border border-violet-500 ${
              getUserEstimate() === value ? "bg-violet-500 text-white" : ""
            } hover:bg-violet-500 hover:text-white rounded grid items-center content-center justify-center text-xl md:text-5xl cursor-pointer`}
            onClick={() => handleSubmit(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="group relative rounded-md">
        <FaUser
          size={20}
          className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointeer-events-none group-focus-within:text-violet-500"
        />
        <input
          className="appearance-none w-full text-sm leading-6 bg-transparent text-slate-900 placeholder:text-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          type="text"
          placeholder="User name..."
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
      </div>
    </section>
  );
};

const RoomEstimates: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { data } = trpc.proxy.rooms.getById.useQuery({ roomId });

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-semibold text-lg">Results</h1>
      <RoomControls roomId={roomId} />
      <table className="table-auto w-full shadow shadow-violet-300">
        <thead className="bg-violet-500 text-white">
          <tr>
            <th className="border-b font-semibold p-4 text-left">Name</th>
            <th className="border-b font-semibold p-4 text-left">Story Points</th>
          </tr>
        </thead>
        <tbody>
          {data?.estimate
            ?.sort(({ userName: a }, { userName: b }) => {
              if (a < b) return -1;
              if (a > b) return 1;
              return 0;
            })
            .map((estimate) => (
              <tr key={estimate.id}>
                <td className="border-b border-violet-100 p-4">{estimate.userName}</td>
                <td className="border-b border-violet-100 p-4">
                  {data.showEstimates || estimate.value === "-" ? (
                    estimate.value
                  ) : (
                    <div className="grid items-center content-center justify-center w-5 aspect-2/3 border rounded text-white bg-violet-500">
                      ✓
                    </div>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
};

const RoomControls: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { data } = trpc.proxy.rooms.getById.useQuery({ roomId });

  const { mutateAsync: deleteAsync, isLoading: isDeleting } =
    trpc.proxy.rooms.deleteEstimates.useMutation();

  const { mutateAsync: showOrHideAsync, isLoading: isShowingOrHiding } =
    trpc.proxy.rooms.showOrHideEstimates.useMutation();

  const { mutateAsync: removeAsync, isLoading: isRemoving } =
    trpc.proxy.rooms.removeUsers.useMutation();

  const handleDeleteEstimates = () => {
    if (!isDeleting) {
      toast.promise(deleteAsync({ roomId }), {
        loading: "Deleting estimates..",
        success: "Estimates deleted!",
        error: "Oops, something went wrong!"
      });
    }
  };

  const handleShowOrHideEstimates = () => {
    if (!isShowingOrHiding) {
      const showEstimates = data?.showEstimates ? false : true;
      toast.promise(showOrHideAsync({ roomId, showEstimates }), {
        loading: showEstimates ? "Showing estimates.." : "Hiding estimates..",
        success: showEstimates ? "Estimates shown!" : "Estimates hidden!",
        error: "Oops, something went wrong!"
      });
    }
  };

  const handleRemoveUsers = () => {
    if (!isRemoving) {
      toast.promise(removeAsync({ roomId }), {
        loading: "Removing users..",
        success: "Users removed!",
        error: "Oops, something went wrong!"
      });
    }
  };

  return (
    <section className="flex justify-between text-violet-500">
      <button onClick={() => handleRemoveUsers()}>
        <FaUserMinus size={24} />
      </button>
      <button
        className={`py-2 px-4 rounded shadow shadow-violet-300 ${
          data?.showEstimates === true ? "bg-violet-500 text-white" : ""
        }`}
        onClick={() => handleDeleteEstimates()}
      >
        Delete Estimates
      </button>
      <button
        className={`py-2 px-4 rounded shadow shadow-violet-300 ${
          data?.showEstimates === false ? "bg-violet-500 text-white" : ""
        }`}
        onClick={() => handleShowOrHideEstimates()}
      >
        {data?.showEstimates === true ? "Hide" : "Show"}
      </button>
    </section>
  );
};

const RoomPageCore: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { refetch } = trpc.proxy.rooms.getById.useQuery({ roomId });

  useSubscribeToEvent("room-updated", () => refetch());

  return (
    <>
      <ShareRoom roomId={roomId} />
      <SubmitEstimate roomId={roomId} />
      <RoomEstimates roomId={roomId} />
    </>
  );
};

const RoomPage: NextPage = () => {
  const { query } = useRouter();

  const [user] = useUser();

  if (!query.roomId || typeof query.roomId !== "string") {
    return null;
  }

  const { roomId } = query;

  return (
    <>
      <main className="px-4 py-10 md:py-20 container mx-auto flex flex-col gap-6 md:gap-12">
        <PusherProvider userId={user.id} roomId={roomId}>
          <RoomPageCore roomId={roomId} />
        </PusherProvider>
        <Toaster />
      </main>
    </>
  );
};

export default RoomPage;
