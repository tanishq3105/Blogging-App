import { BookOpen, Users, Bookmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom';


export const Home = () => {
  const navigate=useNavigate();
  const handleClick=()=>{
    const token=localStorage.getItem('token');
    if(token){
      navigate('/blogs');
    }else{
      navigate('/signup')
    }
  }
  return (

    <div>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 mb-6">
              Discover, Create, and Share Your Story with Blog Hub
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Join a vibrant community of storytellers where your voice matters. Unleash your creativity, connect with like-minded individuals, and inspire others through the power of blogging.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-8 py-3 rounded-md bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 transition-all"
              onClick={handleClick}
              >
                Get started
              </button>
              <button className="px-8 py-3 rounded-md border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 bg-opacity-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-gray-800 bg-gradient-to-br from-gray-800 to-gray-900">
              <BookOpen className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Write Your Story</h3>
              <p className="text-gray-400">Share your thoughts, experiences, and expertise with our growing community of readers.</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-800 bg-gradient-to-br from-gray-800 to-gray-900">
              <Users className="w-12 h-12 text-teal-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Connect with Others</h3>
              <p className="text-gray-400">Engage with fellow writers and readers through comments, likes, and follows.</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-800 bg-gradient-to-br from-gray-800 to-gray-900">
              <Bookmark className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Save and Organize</h3>
              <p className="text-gray-400">Bookmark your favorite articles and organize them into custom collections.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    
  )
}