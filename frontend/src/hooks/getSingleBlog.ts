import axios from "axios";
import { useEffect, useState } from "react";
import { BlogPost } from "../types/blog";

export const getSingleBlog=(id:string="")=>{
    const token=localStorage.getItem('token');
    const [loading,setLoading]=useState(true)
    const [blog,setBlog]=useState<BlogPost>();

    useEffect(()=>{

        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/post/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        .then(response=>{
            
            setBlog(response.data);
            setLoading(false);
        })
    },[])

    return{
        loading,blog
    }
}