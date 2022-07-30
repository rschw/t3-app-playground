const OnlineDot: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  return (
    <div
      className={`inline-block mr-2 w-3 h-3 rounded-full ${
        isOnline ? "bg-green-500" : "bg-slate-400"
      }`}
    ></div>
  );
};

export default OnlineDot;
