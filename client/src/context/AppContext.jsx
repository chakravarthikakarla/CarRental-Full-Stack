// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const currency = import.meta.env.VITE_CURRENCY;

//   const [token, setToken] = useState(null);
//   const [user, setUser] = useState(null);
//   const [isOwner, setIsOwner] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);

//   const [pickupDate, setPickupDate] = useState("");

//   const [returnDate, setReturnDate] = useState("");

//   const [cars, setCars] = useState([]);

//   // Function to check if user is logged in
//   const fetchUser = async () => {
//     try {
//       const { data } = await axios.get("/api/user/data");
//       if (data.success) {
//         setUser(data.user);
//         setIsOwner(data.user.role === "owner");
//       } else {
//         navigate("/");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   //Function to fetch all cars from server

//   const fetchCars = async() =>{
//     try{
//         const {data} = await axios.get('/api/user/cars')
//         data.success ? setCars(data.cars) : toast.error(data.message)
//     } catch(error){
//         toast.error(error.message);
//     }
//   }

//   //Function to log out the user

//   const logout =() =>{
//     localStorage.removeItem('token')
//     setToken(null)
//     setUser(null)
//     setIsOwner(false)
//     axios.defaults.headers.common['Authorization'] =''
//     toast.success("You have been logged out")
//   }

// // useEffect to retrieve the token from localStorage
// useEffect(() =>{
//     const token = localStorage.getItem('token')
//     setToken(token)
// },[])

// //useEffect to fetch user data when token is available
// useEffect(() =>{
//     if(token){
//         axios.defaults.headers.common['Authorization'] = `${token}`
//         fetchUser()
//     }

// },[token])

// useEffect(() =>{
//     if(token){
//         axios.defaults.headers.common['Authorization'] = `${token}`
//         fetchCars()
//     }

// },[token])


//   const value = {
//     navigate, currency, axios, user, 
//     setUser, token , setToken, isOwner, setIsOwner, fetchUser, showLogin, setShowLogin, logout, fetchCars, cars, setCars, pickupDate, returnDate, setPickupDate, setReturnDate
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useAppContext = () => {
//   return useContext(AppContext);
// };


// src/context/AppContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

// create an axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// request interceptor: attach Bearer token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    // ensure "Bearer " prefix
    if (!String(config.headers.Authorization || "").startsWith("Bearer ")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    // remove auth header if no token
    if (config.headers && config.headers.Authorization) {
      delete config.headers.Authorization;
    }
  }
  return config;
});

// response interceptor: centralized error handling (logout on 401)
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // token invalid/expired -> force logout
      localStorage.removeItem("token");
      // we cannot navigate from here; caller will handle UI. But show toast.
      toast.error("Session expired. Please log in again.");
      // Optionally reload to clear app state:
      // window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [cars, setCars] = useState([]);

  // central login/token setter — stores token, updates state
  const saveToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    } else {
      localStorage.removeItem("token");
      setToken(null);
    }
  };

  // logout helper
  const logout = () => {
    saveToken(null);
    setUser(null);
    setIsOwner(false);
    toast.success("You have been logged out");
    navigate("/"); // optional: redirect to home or login
  };

  // fetch user (protected) — if token missing, do nothing
  const fetchUser = async () => {
    try {
      if (!localStorage.getItem("token")) return;
      const { data } = await api.get("/api/user/data");
      if (data?.success) {
        setUser(data.user);
        setIsOwner(data.user?.role === "owner");
      } else {
        // if backend responds success:false, clear auth
        saveToken(null);
        setUser(null);
        setIsOwner(false);
      }
    } catch (error) {
      // handle 401 from interceptor or network errors
      const message = error?.response?.data?.message || error.message;
      toast.error(message);
      // if 401, do a safe logout
      if (error?.response?.status === 401) {
        logout();
      }
    }
  };

  // fetch public cars (no token required server-side)
  const fetchCars = async () => {
    try {
      const { data } = await api.get("/api/user/cars");
      if (data?.success) setCars(data.cars || []);
      else toast.error(data?.message || "Failed to fetch cars");
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      toast.error(message);
    }
  };

  // on mount: fetch cars always, and fetchUser if token exists
  useEffect(() => {
    fetchCars();
    if (token) fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep token state and localStorage in sync if token changes elsewhere
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const value = {
    navigate,
    currency,
    axios: api, // provide configured axios instance
    user,
    setUser,
    token,
    setToken: saveToken,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    returnDate,
    setPickupDate,
    setReturnDate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
