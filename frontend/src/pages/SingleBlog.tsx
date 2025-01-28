import { Link, useParams } from "react-router-dom";
import { Loader2, Clock, Bookmark } from "lucide-react";
import { getSingleBlog } from "../hooks/getSingleBlog";
import { getReadTime } from "../hooks/getReadTime";
import { Avatar } from "../components/Avatar";
import { removeStyles } from "../hooks/removeStyles";
import axios from "axios";
import { toast } from "react-toastify";
import getUserDetails from "../hooks/getUserDetails";
import useIsBookmarked from "../hooks/isBookmarked";

export const SingleBlog = () => {
  const blogId = useParams<string>().id;
  const { loading, blog } = getSingleBlog(blogId);
  const time = getReadTime(blog?.content || "");
  const token = localStorage.getItem("token");
  const userId = getUserDetails().id;
  const {
    isBookmarked,
    bookmarkId,
    checkBookmarkStatus,
    updateBookmarkStatus
  } = useIsBookmarked(blogId as string, userId);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  const handleClick = async () => {
    try {
      if (!isBookmarked) {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/bookmark/create`,
          { postId: blogId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200) {
          await updateBookmarkStatus(true, response.data.bookmark.id);
          toast.success("Bookmark added",{
            className:"bg-gray-800",
            progressClassName:"bg-cyan-500"
          });
        }
      } else {
        const response = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/bookmark/delete`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              id: bookmarkId,
            },
          }
        );
  
        if (response.status === 200) {
          await updateBookmarkStatus(false, "");
          toast.success("Bookmark deleted successfully",{
            className:"bg-gray-800",
            progressClassName:"bg-cyan-500"
          });
        }
      }
      
      // Refresh bookmark status after the operation
      await checkBookmarkStatus();
    } catch (error) {
      console.error("Error handling bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative h-[55vh] sm:h-[70vh] w-full">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img
            src={
              blog?.imageUrl ||
              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=2000"
            }
            alt={blog?.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-gray-900"></div>
        </div>

        {/* Content on top of hero */}
        <div className="relative h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            {blog?.title}
          </h1>

          {/* Author and Date Info */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <Avatar
                author={blog?.author?.name || ""}
                size="w-12 h-12"
                textSize="text-2xl"
              />
              <div>
                <Link to={`/profile/${blog?.authorId}/view`}>
                  <h3 className="text-lg font-medium text-white hover:text-cyan-500 hover:cursor-pointer">
                    {blog?.author?.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-300">
                  {new Date(blog?.publishedDate || "").toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center text-gray-300 text-sm gap-2">
              <Bookmark
                fill={isBookmarked ? "cyan" : "none"}
                color={isBookmarked ? "cyan" : "white"}
                className="hover:cursor-pointer"
                onClick={handleClick}
              />
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                {time + " min read" || "5 min read"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="prose prose-invert lg:prose-xl prose-headings:text-white prose-p:text-gray-300 max-w-none">
          <div
            className="leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: removeStyles(blog?.content || ""),
            }}
          />
        </article>
      </div>
    </div>
  );
};
