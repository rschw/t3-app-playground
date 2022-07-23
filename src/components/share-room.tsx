import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import { FaShareAlt } from "react-icons/fa";

const copyUrlToClipboard = (url: string) => {
  navigator.clipboard.writeText(url);
  toast.success("Link copied to clipboard");
};

const ShareRoom: React.FC<{ roomId: string }> = ({ roomId }) => {
  const shareUrl = `${window.location.origin}/room/${roomId}`;

  return (
    <section className="flex flex-col-reverse items-center gap-4 md:flex-row md:justify-between md:items-start">
      <button
        className="text-violet-500 flex justify-center gap-4 px-4 py-2 rounded shadow shadow-violet-300"
        onClick={() => copyUrlToClipboard(shareUrl)}
      >
        Room {roomId}
        <FaShareAlt size={24} />
      </button>
      <QRCodeSVG value={shareUrl} />
    </section>
  );
};

export default ShareRoom;
