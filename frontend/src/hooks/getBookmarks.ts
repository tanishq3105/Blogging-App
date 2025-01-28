import { useEffect, useState } from "react";
import { BookmarkedPost } from "../types/blog";
import axios from "axios";

const useGetBookmarks = () => {
    const [bookmarkedPosts, setBookmarkedPosts] = useState<BookmarkedPost[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    

    useEffect(() => {

        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    throw new Error('Authentication token not found');
                }

                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/bookmark/get`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setBookmarkedPosts(response.data.bookmarks);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return {
        bookmarkedPosts,
        loading,
    };
};

export default useGetBookmarks;