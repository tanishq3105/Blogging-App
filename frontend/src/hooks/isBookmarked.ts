import axios from "axios";
import { useEffect, useState, useCallback } from "react";

interface IdType {
  id: string;
  userId: string;
  postId: string;
}

const useIsBookmarked = (blogId: string = "", userId: string = "") => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [bookmarkId, setBookmarkId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');

  const checkBookmarkStatus = useCallback(async () => {
    if (!blogId || !userId || !token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/post/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      let found = false;
      response.data.bookmark.forEach((ids: IdType) => {
        if (ids.userId === userId && ids.postId === blogId) {
          setIsBookmarked(true);
          setBookmarkId(ids.id);
          found = true;
        }
      });

      if (!found) {
        setIsBookmarked(false);
        setBookmarkId("");
      }
    } catch (error) {
      console.error("Error checking bookmark status:", error);
      setIsBookmarked(false);
      setBookmarkId("");
    } finally {
      setIsLoading(false);
    }
  }, [blogId, userId, token]);

  // Function to update bookmark status
  const updateBookmarkStatus = useCallback(async (status: boolean, newBookmarkId: string = "") => {
    setIsBookmarked(status);
    setBookmarkId(newBookmarkId);
  }, []);

  useEffect(() => {
    checkBookmarkStatus();
  }, [checkBookmarkStatus]);

  return {
    isBookmarked,
    bookmarkId,
    isLoading,
    checkBookmarkStatus,
    updateBookmarkStatus
  };
};

export default useIsBookmarked;