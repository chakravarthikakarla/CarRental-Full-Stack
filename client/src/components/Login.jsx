import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { setShowLogin, axios, setToken, setUser, navigate, fetchUser } = useAppContext();

  const [state, setState] = React.useState("login"); // "login" or "register"
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const nameRef = React.useRef(null);
  const emailRef = React.useRef(null);

  // close on Escape key
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowLogin(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setShowLogin]);

  // focus first field when mode changes
  React.useEffect(() => {
    if (state === "register") {
      nameRef.current?.focus();
    } else {
      emailRef.current?.focus();
    }
  }, [state]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (loading) return; // prevent double submit

    // Basic validation (match backend rules: password >= 8)
    if (state === "register" && !name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!password.trim() || password.length < 8) {
      toast.error("Please enter a password (minimum 8 characters)");
      return;
    }

    // Ensure axios exists
    if (!axios || typeof axios.post !== "function") {
      toast.error("HTTP client not available. Check your app context.");
      return;
    }

    try {
      setLoading(true);
      const payload = { email, password };
      if (state === "register") payload.name = name;

      const { data } = await axios.post(`/api/user/${state}`, payload);

      if (data && data.success) {
        if (data.token) {
          // let AppContext handle persistence & side effects
          setToken?.(data.token);
          // attempt to fetch user immediately for freshest state
          if (typeof fetchUser === "function") {
            try {
              await fetchUser();
            } catch (_) {
              // fetchUser failure will show its own toast if needed
            }
          }
        }
        if (data.user) {
          setUser?.(data.user);
        }

        toast.success(state === "login" ? "Logged in successfully!" : data.message || "Account created!");
        // close modal and navigate
        setShowLogin(false);
        try {
          navigate?.("/");
        } catch (err) {
          // ignore if navigate isn't provided
        }
        // clear form
        setName("");
        setEmail("");
        setPassword("");
      } else {
        // server responded but success === false
        toast.error((data && data.message) || "Authentication failed");
      }
    } catch (error) {
      // network or unexpected error
      const msg = error?.response?.data?.message || error?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowLogin(false)}
        className="fixed top-0 bottom-0 left-0 right-0 z-[100] flex items-center text-sm text-gray-600 bg-black/50"
        role="dialog"
        aria-modal="true"
      >
        <form
          onSubmit={onSubmitHandler}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
        >
          <p className="text-2xl font-medium m-auto">
            <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
          </p>

          {state === "register" && (
            <div className="w-full">
              <p>Name</p>
              <input
                ref={nameRef}
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                type="text"
                name="name"
                autoComplete="name"
              />
            </div>
          )}

          <div className="w-full">
            <p>Email</p>
            <input
              ref={emailRef}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="email"
              name="email"
              autoComplete="email"
            />
          </div>

          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="password"
              name="password"
              autoComplete={state === "login" ? "current-password" : "new-password"}
            />
          </div>

          {state === "register" ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setState("login");
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
                className="text-primary cursor-pointer"
              >
                click here
              </span>
            </p>
          ) : (
            <p>
              Create an account?{" "}
              <span
                onClick={() => {
                  setState("register");
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
                className="text-primary cursor-pointer"
              >
                click here
              </span>
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (state === "register" ? "Creating..." : "Logging in...") : state === "register" ? "Create Account" : "Login"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
