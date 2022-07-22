import toast from "react-hot-toast";
import { FaShareAlt } from "react-icons/fa";

const ShareRoom: React.FC<{ roomId: string }> = ({ roomId }) => {
  const copyUrlToClipboard = (path: string) => () => {
    if (!process.browser) return;
    navigator.clipboard.writeText(`${window.location.origin}${path}`);
    toast.success("Link copied to clipboard");
  };

  return (
    <>
      <button
        className="text-violet-500 self-center flex justify-center gap-4 px-4 py-2 rounded shadow shadow-violet-300"
        onClick={copyUrlToClipboard(`/room/${roomId}`)}
      >
        Room {roomId}
        <FaShareAlt size={24} />
      </button>
    </>
  );
};

export default ShareRoom;
