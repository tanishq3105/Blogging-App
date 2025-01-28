
import { BlogSection } from '../components/BlogSection'
import Loader from '../components/Loader';
import getBlogs from '../hooks/getBlogs'


export const Blogs = () => {
  const {blogs, loading}=getBlogs();
  
  const allPosts = blogs

  if(loading){
    return(
      <div className='text-white text-5xl flex flex-col justify-center'>
        <div className='flex justify-center'>
          <Loader/>
        </div>
        
      </div>
    )
  }
  else{
    const latestPosts= blogs.reverse().slice(0,3);
    return (
      <div className=''>
          <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BlogSection 
            title="Latest Blog Posts" 
            posts={latestPosts} 
            className="pb-16"
            link='/blog'
          />
          <BlogSection 
            title="All Posts" 
            posts={allPosts}
            className='pb-16'
            link='/blog'
          />
        </div>
      </div>
      </div>
      
    )
  }
  
}