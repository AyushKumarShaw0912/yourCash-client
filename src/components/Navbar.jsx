import axios from 'axios';


import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TextLinkExample() {
  const [cookies, setCookie] = useCookies(['token'])
  const navigate=useNavigate()
  console.log(cookies.token)
  const handleLogout=async()=>{
try {
  const res=await axios.post("https://yourcash-api.onrender.com/api/v1/logout",
    {headers: {'Content-Type': 'application/json'},
     withCredentials : true
    })
  if(res.status=200){
    toast.success("Logout successfully")
    setCookie("token",null)
    localStorage.removeItem("user")
    navigate("/login")
  }
} catch (error) {
 toast.error(error.response.data.message);
}
  }
  return (
    <>
    <nav className="bg-blue-200 shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Website Name */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-indigo-600">
             yourCash
            </h1>
          </div>

          {/* Logout Button */}
          {!cookies.token?<></>:<div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-500 transition duration-200"
            >
              Logout
            </button>
          </div>}
        </div>
      </div>
    </nav>
    <ToastContainer/>
    </>
  );
}

export default TextLinkExample;