import CountUp from "react-countup";

const CounterCard = ({ end, suffix = "+", title }) => {
  return (
    <div className="relative flex flex-col items-center justify-center text-center 
                    bg-[#D9D9D9] backdrop-blur-md 
                    rounded-2xl p-8 
                    border border-[#D9D9D9]
                    hover:scale-105 transition duration-500">

      {/* Watermark Circle 
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-40 h-40 rounded-full border-4 border-yellow-500"></div>
      </div>*/}

      {/* Number */}
      <h2 className="text-4xl text-[#D9D9D9] md:text-5xl font-bold 
                     bg-gradient-to-r from-[#D9D9D9] to-[#D9D9D9] 
                     bg-clip-text text-transparent">
        <CountUp end={end} duration={3} />
        {suffix}
      </h2>

      {/* Title */}
      <p className="mt-4 text-white tracking-widest text-sm md:text-base">
        {title}
      </p>
    </div>
  );
};

export default CounterCard;
