import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaUser, FaUserMinus } from "react-icons/fa";
import ShareRoom from "../../components/ShareRoom";
import { PusherProvider, useSubscribeToEvent } from "../../utils/pusher";
import { trpc } from "../../utils/trpc";
import { useUserId, useUserName } from "../../utils/user-id";

const SubmitEstimate: React.FC<{ roomId: string }> = ({ roomId }) => {
  const estimateValues = ["?", "0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100"];

  const userId = useUserId();

  const [userName, setUserName] = useUserName();

  const [estimate, setEstimate] = useState("");

  const { data } = trpc.proxy.rooms.getById.useQuery({ roomId });

  const tctx = trpc.useContext();

  const { mutate: submitEstimate } = trpc.proxy.rooms.submitEstimate.useMutation({
    onMutate: ({ roomId, value }) => {
      function optimisticUpdateData() {
        if (data) {
          const userEstimate = data.estimate.find((e) => e.userId === userId);

          if (userEstimate) {
            const patchedEstimates = data.estimate.map((e) =>
              e.userId === userId ? { ...e, value, userName } : e
            );
            return { ...data, estimate: patchedEstimates };
          } else {
            const patchedEstimates = [...data.estimate, { userId, userName, value }];
            return { ...data, estimate: patchedEstimates };
          }
        } else {
          return data;
        }
      }

      tctx.queryClient.setQueryData(["rooms.getById", { roomId }], optimisticUpdateData());
    },
    onSuccess: (_, { value }) => {
      toast.success(`${value} story points submitted`);
    },
    onError: (err) => {
      toast.error(`Oops, something went wrong: ${err}`);
    }
  });

  useEffect(() => {
    const estimate = data?.estimate.find(({ userId: id }) => id === userId);
    setEstimate(estimate?.value || "-");
  }, [data, userId]);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-semibold text-lg">Submit estimate</h1>
      <div className="grid grid-cols-6 gap-2 md:gap-4">
        {estimateValues.map((value) => (
          <button
            key={value}
            className={`aspect-2/3 border border-violet-500 ${
              estimate === value ? "bg-violet-500 text-white" : ""
            } hover:bg-violet-500 hover:text-white rounded grid items-center content-center justify-center text-xl md:text-5xl cursor-pointer`}
            onClick={() => submitEstimate({ roomId, userId, userName, value })}
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
          className="appearance-none text-sm leading-6 bg-transparent text-slate-900 placeholder:text-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          type="text"
          placeholder="User name..."
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <span className="ml-4 text-sm text-slate-600">
          Your name will be visible to others after your next estimation
        </span>
      </div>
    </section>
  );
};

const RoomEstimates: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { data, refetch } = trpc.proxy.rooms.getById.useQuery({ roomId });

  useSubscribeToEvent("room-updated", () => refetch());

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

  const tctx = trpc.useContext();

  const { mutate: deleteEstimates } = trpc.proxy.rooms.deleteEstimates.useMutation({
    onMutate: ({ roomId }) => {
      tctx.queryClient.setQueryData(["rooms.getById", { roomId }], {
        ...data,
        estimate: data?.estimate.map((e) => ({ ...e, value: "-" }))
      });
    },
    onError(err) {
      toast.error(`Oops, something went wrong: ${err}`);
    }
  });

  const { mutate: toggleShow } = trpc.proxy.rooms.toggleEstimates.useMutation({
    onMutate: async ({ roomId }) => {
      tctx.queryClient.setQueriesData(["rooms.getById", { roomId }], {
        ...data,
        showEstimates: !data?.showEstimates
      });
    },
    onError(err) {
      toast.error(`Oops, something went wrong: ${err}`);
    }
  });

  const { mutate: removeUsers } = trpc.proxy.rooms.removeUsers.useMutation({
    onMutate: ({ roomId }) => {
      tctx.queryClient.setQueryData(["rooms.getById", { roomId }], { ...data, estimate: [] });
    },
    onError: (err) => {
      toast.error(`Oops, something went wrong: ${err}`);
    }
  });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(data?.showEstimates ?? false);
  }, [data]);

  return (
    <section className="flex justify-between text-violet-500">
      <button onClick={() => removeUsers({ roomId })}>
        <FaUserMinus size={20} />
      </button>
      <button
        className={`py-2 px-4 rounded shadow shadow-violet-300 ${
          visible ? "bg-violet-500 text-white" : ""
        }`}
        onClick={() => deleteEstimates({ roomId })}
      >
        Delete Estimates
      </button>
      <button
        className={`py-2 px-4 rounded shadow shadow-violet-300 ${
          !visible ? "bg-violet-500 text-white" : ""
        }`}
        onClick={() => toggleShow({ roomId })}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </section>
  );
};

const RoomPage: NextPage = () => {
  const { query } = useRouter();
  const userId = useUserId();

  if (!query.roomId || typeof query.roomId !== "string") {
    return null;
  }

  const { roomId } = query;

  return (
    <>
      <main className="px-4 py-10 md:py-20 container mx-auto flex flex-col gap-6 md:gap-12">
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
