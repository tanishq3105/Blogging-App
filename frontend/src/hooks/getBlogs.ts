import axios from "axios";
import { useEffect, useState } from "react";
import { BlogPost } from "../types/blog";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const getBlogs=()=>{
    const token=localStorage.getItem('token')
    const authHeader="Bearer "+token;
    const [loading,setLoading]=useState(true);
    const [blogs,setBlogs]=useState<BlogPost[]>([]);
    const input=useSelector((state:RootState)=>state.update.value) ||'';
    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/bulk?filter=${input}`,{
            headers:{
                Authorization:authHeader
            }
        }).then((response)=>{
            setBlogs(response.data.posts)
            setLoading(false)
        })
    },[input]);

    return{
        loading, blogs
    }
}


export default getBlogs;