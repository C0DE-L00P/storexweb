import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    con_password: "",
  });
  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, setIsLoading } = useContext(UserContext);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    //Validations
    if (formData.email === "" || formData.password === "") {
      setIsLoading(false);
      return alert("Credentials can't be empty");
    }

    let res;
    if (isLogin) {
      //Login Process
      delete formData.name;
      delete formData.con_password;
      try {
        res = await axios.post(
          import.meta.env.VITE_BASE_URL + "/api/login",
          formData
        );
      } catch (error) {
        alert("Something went wrong", error);
        setIsLoading(false)
      }
    } else {
      //Register Process
      if (formData.name === "") return alert("Name can't be empty");
      if (formData.con_password !== formData.password)
        return alert("Passwords are not identical");

      delete formData.con_password;

      try {
        res = await axios.post(
          import.meta.env.VITE_BASE_URL + "/api/register",
          formData
        );
      } catch (error) {
        alert("Something went wrong", error);
        setIsLoading(false)
      }
    }

    //Results
    if (res.status !== 200) {
      setIsLoading(false);
      return alert("Something went wrong");
    }
    localStorage.setItem("AcToken", res.data.authorisation.token); //context detect changes in localStorage and update user

    setTimeout(() => {
      //Adding delay as backend takes sometimes to assign keys for some reason
      setIsLoading(false);
      navigate("/");
    }, 2000);
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <motion.form
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 p-12 bg-slate-800 backdrop-blur-md rounded-md shadow-md w-96"
      >
        <h2 className="text-3xl mb-3">{isLogin ? "Login" : "Register"}</h2>
        <input
          className={`p-2 ${isLogin ? "hidden" : ""}`}
          type={"text"}
          name="name"
          placeholder="Full Name"
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
        />
        <input
          className="p-2"
          type={"text"}
          name="email"
          placeholder="Email"
          onChange={(e) =>
            setFormData((p) => ({ ...p, email: e.target.value }))
          }
        />
        <input
          className="p-2"
          type={"password"}
          name="password"
          placeholder="Password"
          onChange={(e) =>
            setFormData((p) => ({ ...p, password: e.target.value }))
          }
        />
        <input
          className={`p-2 ${isLogin ? "hidden" : ""}`}
          type={"password"}
          name="con_password"
          placeholder="Confirm Password"
          onChange={(e) =>
            setFormData((p) => ({ ...p, con_password: e.target.value }))
          }
        />
        <input
          type="submit"
          title="Login"
          disabled={isLoading}
          className="rounded-xl bg-slate-400 p-3 mt-3"
        />
      </motion.form>

      <button
        className="rounded-xl bg-slate-700 outline-2 outline-black p-3 mt-3 shadow-md"
        onClick={() => setIsLogin((p) => !p)}
      >
        {isLogin ? "Register New Account" : "Login my account"}
      </button>
    </div>
  );
}
