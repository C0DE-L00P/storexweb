import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import UserContext from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home({ genre }) {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const { AxClient, setIsLoading } = useContext(UserContext);
  const navigate = useNavigate()
  

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(search.toLowerCase())
  );

  function fetchMovies(url) {
    setIsLoading(true)
    AxClient.get(url)
      .then((res) => {
        setMovies(res.data.message);
      })
      .catch((err) => console.log("error", err)).finally(()=> setIsLoading(false))
  }

  useEffect(() => {
    genre === 0
      ? fetchMovies("/api/movies")
      : fetchMovies("/api/moviesByCategory/" + genre);
  }, [genre]);

  return (
    <>
      <div className="flex flex-row justify-between mb-6 container items-center w-full text-center">
        <div className="h-fit w-full">
          <input
            type={"search"}
            placeholder="Search"
            className="px-4 rounded-md h-12"
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-slate-700 ml-3" onClick={()=> {navigate('/movie/new')}}>+</button>
        </div>
      </div>
      <motion.div
        layout
        className="flex flex-row flex-wrap gap-3 justify-center"
      >
        <AnimatePresence>
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
