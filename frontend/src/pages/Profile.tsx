import { BlogSection } from "../components/BlogSection";
import getMyBlogs from "../hooks/getMyBlogs";
import { NameSection } from "../components/NameSection";
import getUserDetails from "../hooks/getUserDetails";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";
import useGetBookmarks from "../hooks/getBookmarks";
import { useState } from "react";

export const Profile = () => {
  const { type, id } = useParams();
  const { name, email } = getUserDetails();
  const { authoName, myPost, loading } = getMyBlogs(id);
  const { bookmarkedPosts } = useGetBookmarks();
  const [isSelected, setIsSelected] = useState(true);
  if (loading) {
    return <Loader />;
  } else {
    myPost.reverse();
    return (
      <div className="">
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <NameSection
              name={type === "edit" ? name : authoName}
              email={type === "edit" ? email : authoName[0] + "***@gmail.com"}
            />
            <div className="flex flex-col gap-8">
              <div className={`${(type==="view")?"hidden":"relative border-b-4 border-cyan-500"}`}>
                <div className="flex w-fit">
                  <div
                    className="absolute h-full bg-cyan-500 rounded-t-xl transition-all duration-300 ease-in-out w-32"
                    style={{
                      transform: `translateX(${
                        isSelected ? "0" : "calc(100% + 16px)"
                      })`,
                    }}
                  />
                  <button
                    className={`w-32 px-4 py-1 text-white text-xl rounded-t-xl relative z-10 transition-colors duration-300
            ${isSelected ? "text-white" : "border hover:bg-cyan-500/10"}`}
                    onClick={() => setIsSelected(true)}
                  >
                    My Blogs
                  </button>
                  <div className="w-4" /> {/* Fixed 16px gap */}
                  <button
                    className={`w-32 px-4 py-1 text-white text-xl rounded-t-xl relative z-10 transition-colors duration-300
            ${!isSelected ? "text-white" : "border hover:bg-cyan-500/10"}`}
                    onClick={() => setIsSelected(false)}
                  >
                    Saved Blogs
                  </button>
                </div>
              </div>

              {isSelected ?(myPost.length===0)?<div className="text-gray-500 text-xl text-center"> 
                  No Posts Available
              </div>: (
                <BlogSection
                  title={
                    type === "edit" ? "Edit Your Blog Posts" : "Author's Blogs"
                  }
                  posts={myPost}
                  className="pb-16"
                  link={type === "edit" ? "/update" : "/blog"}
                />
              ) : (bookmarkedPosts.length===0)?<div className="text-gray-500 text-xl text-center"> 
                  No Posts Bookmarked
              </div> :(
                <BlogSection
                  title={"Saved Blogs"}
                  bookmarkedPost={bookmarkedPosts}
                  className="pb-16"
                  link={"/blog"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};
