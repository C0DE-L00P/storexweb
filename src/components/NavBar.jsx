import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import Logo from "../assets/logo.svg";

export default function NavBar({
  genre,
  setGenre,
  showList,
  setShowList,
  customClasses,
}) {
  const { genres } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <nav
      className={`bg-white border-gray-200 px-2 md:px-4 py-2.5 dark:bg-gray-900 ${customClasses}`}
    >
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <span className="flex items-center">
          <img src={Logo} className="mr-3 h-6 sm:h-9" alt="Logo" />
          <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">
            Cima
          </span>
        </span>
        <div className="flex items-center md:order-2">
          <Link
            to={"/login"}
            onClick={()=>localStorage.clear()}
            className={`text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 mr-1 md:mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 ${!localStorage.getItem('AcToken')?'hidden':'block'}`}
          >
            Logout
          </Link>
          <Link
            to={"/login"}
            className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 mr-1 md:mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ${localStorage.getItem('AcToken')?'hidden':'block'}`}
          >
            Login
          </Link>
          <button
            data-collapse-toggle="mega-menu"
            type="button"
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="mega-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              aria-hidden="true"
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div
          id="mega-menu"
          className="hidden justify-between items-center w-full text-sm md:flex md:w-auto md:order-1"
        >
          <ul className="flex flex-col mt-4 font-medium md:flex-row md:space-x-8 md:mt-0">
            <li className="cursor-pointer">
              <a
                onClick={() => {
                  setGenre(0);
                  navigate("/");
                  setShowList(false);
                }}
                // className={`block py-2 pr-4 pl-3border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0  md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700 ${genre===0? 'dark:text-blue-600 text-blue-600':'dark:text-grey-600 text-gre-600'}`}
              >
                All Movies
              </a>
            </li>
            <li>
              <button
                id="mega-menu-dropdown-button"
                data-dropdown-toggle="mega-menu-dropdown"
                className="flex justify-between items-center p-6 outline-none pr-4 pl-3 w-full bg-transparent font-medium text-gray-700 border-b md:w-auto hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-600 md:p-0 dark:text-gray-400 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                onClick={() => setShowList((p) => !p)}
              >
                Genres{" "}
                <svg
                  aria-hidden="true"
                  className="ml-1 w-5 h-5 md:w-4 md:h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <div
                id="mega-menu-dropdown"
                className={`absolute z-10 w-auto text-sm bg-white rounded-lg border border-gray-100 shadow-md dark:border-gray-700 dark:bg-gray-700 ${
                  showList ? "grid" : "hidden"
                }`}
              >
                <div className="p-4 pb-0 text-gray-900 md:pb-4 dark:text-white">
                  <ul
                    className="space-y-4"
                    aria-labelledby="mega-menu-dropdown-button"
                  >
                    {genres.map(({ id, name }) => (
                      <li className="cursor-pointer" key={id}>
                        <a
                          onClick={() => {
                            setGenre(id);
                            navigate("/");
                            setShowList(false);
                          }}
                          className={`hover:text-blue-600 dark:hover:text-blue-500 ${
                            genre === id
                              ? "text-blue-600 dark:text-blue-600"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
