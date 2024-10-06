import React,{useState} from 'react';
import axios from "axios"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const [confirmPassword,setConfirmPassword]=useState("")
const navigate= useNavigate()
const handleSubmit=async(e)=>{
    e.preventDefault()
   
   try {
    const res=await axios.post("https://yourcash-api.onrender.com/api/v1/register",{
        username,
        password
    })
    if(password!=confirmPassword){
        toast.error("Password not matched")
    }else{
        if(res.status==201){
          toast.success("Sigup successfull")
           navigate("/login")
        }else{
            toast.error("Signup failed")
        }
    }
   } catch (error) {
   toast.error(error.response.data.message);
   }

}

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Sign Up</h2>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm text-gray-700">Username</label>
            <input
              type="text"
              id="name"
              placeholder="Username"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Your password"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-500 transition duration-200"
          >
            Sign Up
          </button>
          <ToastContainer/>
          <p className="mt-4 text-sm text-gray-600 text-center">
            Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
