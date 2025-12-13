import React from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const { setShowLogin, axios, setToken } = useAppContext();
  const navigate = useNavigate();
  const [state, setState] = React.useState("login"); // "login" or "register"
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(`/api/user/${state}`, { name, email, password });

      if (data.success && data.token) {
        // ✅ Set token in context & axios
        setToken(data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        localStorage.setItem("token", data.token);

        toast.success(state === "login" ? "Logged in successfully" : "Account created!");
        setShowLogin(false);

        // ✅ Navigate after token is set
        navigate("/");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 bg-white p-8 rounded-lg shadow-lg w-80"
      >
        <p className="text-2xl font-medium text-center">
          <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />

        <p className="text-sm text-center mt-2">
          {state === "login" ? (
            <>
              Create an account?{" "}
              <span onClick={() => setState("register")} className="text-primary cursor-pointer">
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setState("login")} className="text-primary cursor-pointer">
                Login
              </span>
            </>
          )}
        </p>

        <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};
export default Login;
