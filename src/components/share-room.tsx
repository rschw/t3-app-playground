import toast, { Toaster } from "react-hot-toast";
import { FaShareAlt } from "react-icons/fa";

const ShareRoom: React.FC<{ roomId: string }> = ({ roomId }) => {
  const copyUrlToClipboard = (path: string) => () => {
    if (!process.browser) return;
    navigator.clipboard.writeText(`${window.location.origin}${path}`);
    toast.success("URL copied to clipboard!");
  };

  return (
    <>
      <button
        className="self-center flex justify-center gap-4 px-4 py-2 bg-violet-500 hover:bg-violet-700 text-white rounded"
        onClick={copyUrlToClipboard(`/room/${roomId}`)}
      >
        Room <span className="font-semibold">{roomId}</span>
        <FaShareAlt size={24} />
      </button>
      <Toaster />
    </>
  );
};

export default ShareRoom;
