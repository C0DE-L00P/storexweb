import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { FaPen } from "react-icons/fa";
import { IoSave } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";
import placeholderImg from "../assets/placeholder.webp";

export default function Details({ setGenre }) {
  const navigate = useNavigate();
  const { AxClient, genres, setIsLoading } = useContext(UserContext);
  const [isEditting, setIsEditting] = useState(false);
  const [movie, setMovie] = useState({ category: {} });
  const indicatorRef = useRef(null);
  const inputImgRef = useRef(null);

  //Get the movie by id

  const location = useLocation();
  const movieId = location.pathname.replace("/movie/", "");
  useEffect(() => {
    setIsLoading(true);
    if (!isNaN(movieId))
      //Means Editting
      AxClient.get(import.meta.env.VITE_BASE_URL + "/api/movies/" + movieId)
        .then((res) => {
          setMovie(res.data.message);
        })
        .catch((err) => {
          console.error("error", err);
          setIsEditting(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    else {
      //Means New movie
      setIsEditting(true);
      setIsLoading(false);
    }
  }, []);

  //Movie data

  const {
    id = "",
    name = "",
    description = "",
    category: { id: categoryId, name: categoryName },
  } = movie;

  //detect the image url/data:image to prepare for preview
  let { image } = movie;
  image =
    image && image.split("/")[0].includes("data:image")
      ? image
      : image
      ? import.meta.env.VITE_BASE_URL + "/" + image
      : undefined;

  function handleChange(val, key) {
    setMovie((p) => {
      p[key] = isNaN(val) ? val : +val; //To Convert to integer if number
      return p;
    });
  }

  //To get base64 data of the file to preview NOTICE need to click save to preview
  const openFile = (event) => {
    const reader = new FileReader();

    reader.onload = function () {
      let dataURL = reader.result;
      handleChange(dataURL, "image");
    };

    reader.readAsDataURL(event.target.files[0]);
  };

  //Handling requests of POST or Edit passed on hidden movieID input
  function handleDelete() {
    setIsLoading(true);
    AxClient.post("/api/movies/" + movieId, { _method: "delete" })
      .then(navigate.bind(this, "/"))
      .catch(console.log)
      .finally(() => setIsLoading(false));
  }

  function handleSave(e) {
    e.preventDefault();

    let movieObj = {};
    let url = "";
    let movieId = indicatorRef.current.value;
    let image = inputImgRef.current.value;
    let form = new FormData();
    form.append('name', movie.name)
    form.append('description', movie.description)
    form.append('category', movie.category)
    form.append('category_id', movie.category.id)
    form.append('image',inputImgRef.current.value)
    // console.log(image);

    if (movieId === "") {
      //POST new movie
      url = import.meta.env.VITE_BASE_URL + "/api/movies";
    } else {
      //POST to edit existing one
      url = import.meta.env.VITE_BASE_URL + "/api/movies/" + id;
      movieObj._method= "put";
    }

    setIsLoading(true);
    AxClient.post(url, form,{headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      }})
      .then(console.log)
      .catch(console.log)
      .finally(() => setIsLoading(false), setIsEditting(false));
  }

  return (
    <div
      className="flex flex-col justify-center items-center md:flex-row"
      style={{ height: "calc(100vh - 160px)" }}
    >
      {/* BACKGROUND IMAGE */}
      <div
        className="fixed top-0 bottom-0 left-0 right-0 opacity-5 -z-10"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* MOVIE IMAGE */}
      <div className="w-9/12 md:w-3/6 mt-36 md:mt-2 relative">
        <img
          src={image ? `${image}` : placeholderImg}
          className={`rounded-lg shadow-lg bg-slate-600 z-10 w-full`}
        />
        <div
          className={`absolute top-0 bottom-0 left-0 right-0 bg-slate-800/60 z-30 items-center justify-center flex opacity-0 ${
            isEditting ? "hover:opacity-100" : ""
          }`}
        >
          <input
            type={"file"}
            className={"hidden"}
            id="imgChose"
            ref={inputImgRef}
            accept="image/png, image/jpeg"
            onChange={(e) => openFile(e)}
          />{" "}
          <label htmlFor={`${isEditting ? "imgChose" : ""}`}>
            <FiUpload
              size={80}
              cursor={isEditting ? "Pointer" : "auto"}
              className="hover:text-slate-600 p-2"
            />
          </label>
        </div>
      </div>

      {/* EDITING BUTTON */}
      <span className="absolute top-[100px] right-10 flex flex-row">
        <button
          className={`bg-slate-700 ml-3 ${isEditting ? "block" : "hidden"}`}
          onClick={handleSave}
        >
          {<IoSave />}
        </button>

        <button
          className={"bg-slate-700 ml-3"}
          onClick={setIsEditting.bind(this, (p) => !p)}
        >
          {<FaPen />}
        </button>
        <button
          className={`bg-slate-700 ml-3 hover:border-red-400 ${
            id !== "" ? "block" : "hidden"
          }`}
          onClick={handleDelete}
        >
          {<AiFillDelete className="text-red-400" />}
        </button>
      </span>

      {/* MOVIE DETAILS */}
      <div className="flex flex-col w-3/6 justify-center items-center md:items-start p-6 h-full">
        {/* TO DETECT IF THIS IS A NEW MOVIE */}
        <input
          type="text"
          className="hidden"
          value={id}
          readOnly
          ref={indicatorRef}
        />
        <div className="mb-1">
          <input
            placeholder="Title"
            type="text"
            onChange={(e) => handleChange(e.target.value, "name")}
            className={`text-3xl px-2 w-full text-center md:text-start rounded-sm ${
              !isEditting ? "hidden" : "block"
            }`}
            defaultValue={name}
          />
          <p
            className={`text-4xl text-center md:text-start ${
              isEditting ? "hidden" : "block"
            }`}
          >
            {name}
          </p>{" "}
        </div>

        <div className="mb-6">
          <select
            defaultValue={categoryId}
            onChange={(e) => {
              handleChange(e.target.value, "category_id");
              handleChange(
                {
                  id: +e.target.value,
                  name: e.target.options[e.target.selectedIndex].label,
                },
                "category"
              );
            }}
            name="genres"
            className={`p-2 rounded-sm   ${!isEditting ? "hidden" : "block"}`}
            disabled={!isEditting}
          >
            {genres.map(({ id, name }) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </select>
          <span
            onClick={() => {
              setGenre(categoryId);
              navigate("/");
            }}
            className={`rounded-md bg-black w-fit px-4 py-1 hover:bg-black/40 duration-100 cursor-pointer text-white  ${
              isEditting ? "hidden" : "block"
            }`}
          >
            {categoryName}
          </span>{" "}
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Description"
            onChange={(e) => handleChange(e.target.value, "description")}
            className={
              !isEditting
                ? "hidden"
                : "block" + "w-full text-start rounded-sm px-2"
            }
            defaultValue={description}
          />
          <span className={isEditting ? "hidden" : "block"}>{description}</span>{" "}
        </div>
      </div>
    </div>
  );
}
