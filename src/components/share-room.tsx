import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaShareAlt } from "react-icons/fa";

const ShareRoom: React.FC<{ roomId: string }> = ({ roomId }) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/room/${roomId}`);
  }, [roomId]);

  const copyUrlToClipboard = () => () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  return (
    <section className="flex justify-around gap-4">
      <button
        className="text-violet-500 self-center flex justify-center gap-4 px-4 py-2 rounded shadow shadow-violet-300"
        onClick={copyUrlToClipboard()}
      >
        Room {roomId}
        <FaShareAlt size={24} />
      </button>
      <QRCodeSVG value={url} />
    </section>
  );
};

export default ShareRoom;
