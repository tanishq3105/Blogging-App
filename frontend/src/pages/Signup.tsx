import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { Quote } from "../components/Quote";
import { Authup } from "../components/Authup";

export const Signup=()=>{
  const navigate=useNavigate();
  const token=localStorage.getItem('token');
  useEffect(()=>{
    if(token)
        {
            navigate('/blogs');
        }
},[])
    return (

        <div className="bg-customDark md:grid grid-cols-2">
        <div className="flex justify-center items-center h-screen md:h-auto">
          <Authup />
        </div>
        <div className="hidden md:block">
          <Quote />
        </div>
      </div>
      
    )
}