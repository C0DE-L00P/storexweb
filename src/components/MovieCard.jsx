import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function MovieCard({
  movie: { category_id, description, id, image, name },
}) {
  const navigate = useNavigate();
  return (
    <motion.div
      layout
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      className="w-60  rounded-md"
      onClick={() => navigate("/movie/" + id)}
    >
      <div
        className="overflow-hidden rounded-lg hover:shadow-lg relative flex flex-col-reverse"
        style={{
          minHeight: 320,
          backgroundImage: `url("${import.meta.env.VITE_BASE_URL}/${image}")`,
          backgroundBlendMode: "darken",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute top-0 bottom-0 right-0 left-0 hover:bg-slate-300/20 duration-300 ease-in-out cursor-pointer"></div>
      </div>
      <h3 className="text-start text-md m-2 text-white font-semibold capitalize cursor-pointer hover:text-gray-300">
        {name}
      </h3>
    </motion.div>
  );
}
