

const Loading = () => {
  return (
    <div className="absolute inset-0 w-full z-50 flex items-center justify-center bg-white bg-opacity-50 h-full">
      <div className="border-t-4 border--500 rounded-full animate-spin h-12 w-12"></div>
    </div>
  );
};

export default Loading;
