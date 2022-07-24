import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import { FaCopy } from "react-icons/fa";

const copyUrlToClipboard = (url: string) => {
  navigator.clipboard.writeText(url);
  toast.success("Link copied to clipboard");
};

const ShareRoom: React.FC<{ roomId: string }> = ({ roomId }) => {
  const shareUrl = `${window.location.origin}/room/${roomId}`;

  return (
    <section className="flex flex-col-reverse items-center gap-6 md:flex-row md:justify-between md:items-start">
      <button
        className="flex justify-center gap-4 px-4 py-2 rounded shadow shadow-violet-300"
        onClick={() => copyUrlToClipboard(shareUrl)}
      >
        <span className="text-violet-500">Room</span>
        <span className="font-light">{roomId}</span>
        <FaCopy size={24} className="text-violet-500" />
      </button>
      <QRCodeSVG value={shareUrl} />
    </section>
  );
};

export default ShareRoom;
