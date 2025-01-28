import axios from "axios";
import { useEffect, useState } from "react";

 const getUserDetails=()=>{
    const auth=`Bearer ${localStorage.getItem("token")}`;
    const authHeader=auth;
    const [name,setName]=useState<string>("");
    const [email,setEmail]=useState<string>("");
    const [id,setId]=useState<string>("");
    const [loading,setLoading]=useState<boolean>(true);
        useEffect(()=>{
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/user-details`,{
            headers:{
                Authorization:authHeader
            }
        }
        ).then((response)=>{
            setName(response.data.name[0].name);
            setEmail(response.data.name[0].email);
            setId(response.data.name[0].id);
            setLoading(false);
        });
    },[])
    return {
        name,email,id,loading
    }
}
export default getUserDetails;