import { BlogPost, BookmarkedPost } from '../types/blog'
import { BlogCard } from './BlogCard'

interface BlogSectionProps {
  title: string
  posts?: BlogPost[],
  bookmarkedPost?:BookmarkedPost[],
  className?: string
  link?:string
}

export const BlogSection = ({ title, posts, bookmarkedPost, className = '',link }: BlogSectionProps) => (
  <section className={className}>
    <h2 className={`font-bold mb-8 ${title === 'Latest Blog Posts' 
      ? 'text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400'
      : 'text-2xl text-white'
    }`}>
      {title}
    </h2>
    {(title==="Saved Blogs")? <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {bookmarkedPost?.map((post) => (
        <BlogCard key={post.id} post={post.post} link={link} />
      ))}
    </div>:<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts?.map((post) => (
        <BlogCard key={post.id} post={post} link={link} />
      ))}
    </div>}

  </section>
)