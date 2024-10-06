import React, { useState } from 'react';
import axios from "axios"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from 'react-router-dom';
import { Cookies, useCookies } from 'react-cookie';

const Login = () => {
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const [cookies,setCookies] = useCookies(['token']);
    const navigate=useNavigate()
const handleSubmit=async(e)=>{
    try{
        e.preventDefault()
const res=await axios.post("https://yourcash-api.onrender.com/api/v1/login",{
    username,password
},{headers: {'Content-Type': 'application/json'},
withCredentials: true }
)

if(res.status==200){
    toast.success("Login successfull!", {
      });
      setCookies("token",res.data.token)
localStorage.setItem("user",JSON.stringify(res.data.user))
    navigate("/")
      
}
    }catch(error){
        toast.error(error.response.data.message);
    }


}

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-700">Welcome Back!</h2>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              placeholder="username"
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Your password"
             className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-500 transition duration-200"
          >
            Login
          </button>
          <ToastContainer />
          <p className="mt-4 text-sm text-gray-600 text-center">
            Don't have an account? <Link to="/signup" className="text-indigo-600 hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
