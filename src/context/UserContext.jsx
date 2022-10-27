import { createContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate()

  const AxClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      authorization: "Bearer " + localStorage.getItem("AcToken"),
    },
  });

  // Response interceptor to check if any 403 errors then clear locals
  AxClient.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response?.status === 403) {
        localStorage.clear();
        navigate('/login')
        setIsLoading(false)
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    //Get all categories

    AxClient.get("/api/category")
      .then((res) => setGenres(res.data.message))
      .catch((err) => console.error("err", err));
  }, [localStorage.getItem("AcToken")]);

  return (
    <UserContext.Provider
      value={{ user, setUser, isLoading, setIsLoading, AxClient, genres }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
