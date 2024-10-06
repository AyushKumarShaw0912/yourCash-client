import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Navbar from "./components/Navbar";
import Spinner from "./components/Spinner"
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import NotFoundPage from "./pages/404";
import { useCookies } from "react-cookie";
import axios from "axios";

export default function App() {
  const [cookies,setCookies] = useCookies(['token']);
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(true);  // State to handle loading

  // Function to check if the user is authenticated
  const checkAuth = async () => {
    try {
      await axios.get("https://yourcash-api.onrender.com/api/v1/authcheck", {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      setUserExists(true); 
    } catch (error) {
      setUserExists(false); 
      console.log(error)
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    checkAuth();
  }, [cookies.token]);  // Re-run when token changes

  // While checking auth status, show a loading screen
  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><Spinner/></div>;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Redirect user based on authentication */}
        <Route path="/login" element={!userExists ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!userExists ? <Signup /> : <Navigate to="/" />} />
        <Route path="/" element={userExists ? <Home /> : <Navigate to="/login" />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
