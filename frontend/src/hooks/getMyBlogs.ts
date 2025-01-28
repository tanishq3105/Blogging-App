import { useEffect, useState } from "react";
import { BlogPost } from "../types/blog";
import axios from "axios";

const getMyBlogs = (id: string | undefined) => {
    const [myPost, setMyPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [authoName,setAuthorName]=useState<string >("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setError(null);

        // Don't make the API call if id is undefined or empty
        if (!id) {
            return;
        }

        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    throw new Error('Authentication token not found');
                }

                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/myblogs/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setMyPosts(response.data);
                setAuthorName(response.data[0].author.name)
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
                setLoading(false);
            }
        };

        fetchPosts();
    }, [id]);

    return {
        myPost,
        loading,
        error,
        authoName
    };
};

export default getMyBlogs;