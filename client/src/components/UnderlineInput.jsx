const UnderlineInput = ({ placeholder }) => {
  return (
    <input
      placeholder={placeholder}
      className="
        w-full bg-transparent
        border-b border-black/30
        focus:outline-none
        focus:border-[#FC6CB4]
        hover:border-[#731162]
        transition-all duration-300
        placeholder-black/50 py-2
      "
    />
  );
};

export default UnderlineInput;
