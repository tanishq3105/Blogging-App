import { Clock } from "lucide-react"
import type { BlogPost } from "../types/blog"
import { Avatar } from "./Avatar"
import { stripHtml } from "../hooks/stripHtml"
import { getReadTime } from "../hooks/getReadTime"
import { Link } from "react-router-dom"

interface BlogCardProps {
  post: BlogPost,
  link?: string
} 

export const BlogCard = ({ post, link }: BlogCardProps) => {
  const content = stripHtml(post.content)
  const time = getReadTime(post.content)

  return (
    <Link to={link +'/' + post.id} className=" h-full">
      <article className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden w-[400px] sm:transition-all duration-300 ease-in-out sm:hover:scale-105 sm:hover:shadow-lg sm:hover:shadow-cyan-500/50 sm:hover:cursor-pointer h-full flex flex-col">
        <div className="relative pb-[56.25%]">
          <img
            src={
              post.imageUrl ||
              "https://media.istockphoto.com/id/1147544806/vector/no-thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=Ni8CpW8dNAV0NrS6Odo5csGcWUySFydNki9FYi1XHYo="
            }
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover p-2 rounded-xl"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-xl font-semibold text-white mb-2 hover:text-cyan-400 transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-gray-400 mb-4 line-clamp-3 flex-grow">{content}</p>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <Avatar author={post.author?.name as string} size={"w-8 h-8"} />
              <div>
                <p className="text-sm font-medium text-white">{post.author?.name}</p>
                <p className="text-xs text-gray-400">{post.publishedDate}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <Clock size={14} className="mr-1" />
              {time} min read
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

