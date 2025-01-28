import { PenSquare, Search, User, LogOut, X, Menu } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import getUserDetails from '../hooks/getUserDetails'
import { Avatar } from './Avatar'
import { useOnClickOutside } from 'usehooks-ts'
import { useDispatch } from 'react-redux'
import { update } from '../redux/features/search/searchSlice'
import { Delete } from './Delete'

export const AppBar = () => {
  const location = useLocation()
  const isHomePage = location.pathname === '/';
  const isAuthPage=location.pathname==='/signup'||location.pathname==='/signin';
  const [showDropdown, setShowDropdown] = useState(false)
  const token=localStorage.getItem('token');
  const isSignedIn = (token)?true:false;
  const [showSearch, setShowSearch] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showDialog, setShowDialog]=useState(false);
  const navigate=useNavigate();
  let isLoading=false;
  let currentUser={
    name:'',
    email:''
  };
  const {email,name,loading,id}=getUserDetails();
    isLoading=loading;
    currentUser = {
    name: name,
    email: email,
  }
  const ref=useRef(null);
  const dispatch=useDispatch();
  const HandleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
   dispatch(update(e.target.value));
  }
  useOnClickOutside(ref,()=>{setShowDropdown(false)
    setShowMobileMenu(false);
  });

  const handleLogout=()=>{
    localStorage.clear();
    navigate('/signup')
  }

  return ( !isLoading && !isAuthPage &&
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent bg-clip-text">
              Blog Hub
            </span>
          </Link>
          
          <div className='flex sm:gap-4'>

          <div className={`flex items-center transition-all duration-300 ${showSearch ? 'w-[200px] sm:w-[400px]' : 'w-10'}`}>
                  {showSearch ? (
                    <div className="flex items-center w-full bg-gray-800 rounded-md">
                      <input
                        type="text"
                        placeholder="Search blogs..."
                        className="w-full px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                        autoFocus
                        onChange={HandleChange}
                      />
                      <button 
                        onClick={() =>{ setShowSearch(false)
                          dispatch(update(""))
                        }}
                        className="p-2 text-gray-400 hover:text-white"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowSearch(true)}
                      className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <Search size={20} />
                    </button>
                  )}
                </div>
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link
                  to="/create"
                  className="flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 transition-all"
                >
                  <PenSquare size={18} className="mr-2" />
                  Write
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-cyan-500 transition-all"
                  >
                    <Avatar author={currentUser.name } size='w-8 h-8' textSize='text-lg'/>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 border border-gray-700"
                    ref={ref}
                    >
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{currentUser.name}</p>
                        <p className="text-xs text-gray-400">{currentUser.email}</p>
                      </div>
                      <Link
                        to={`/profile/${id}/edit`}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={()=>setShowDropdown(false)}
                      >
                        <User size={16} className="mr-2" />
                        Profile
                      </Link>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => {
                          // Add logout logic here
                         
                          setShowDialog(true);
                          
                        
                        }}
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </button>
                      
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {!isHomePage && (
                  <Link
                    to="/"
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 transition-all"
                  >
                    Get Started
                  </Link>
                )}
                <Link
                  to="/signin"
                  className="px-4 py-2 rounded-md border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
          

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
  <div className="md:hidden bg-gray-800 border-t border-gray-700" ref={ref}>
    <div className="px-4 pt-2 pb-3">
      {isSignedIn ? (
        <>
          <div className="flex items-center mb-4 pt-2">
            <Avatar author={currentUser.name} size='w-10 h-10' />
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{currentUser.name}</p>
              <p className="text-xs text-gray-400">{currentUser.email}</p>
            </div>
          </div>
          <Link
            to="/create"
            className="flex items-center justify-center w-full px-4 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 transition-all mb-2"
            onClick={() => setShowDropdown(false)} // Close dropdown on click
          >
            <PenSquare size={18} className="mr-2" />
            Write
          </Link>
          <Link
            to={`/profile/${id}/edit`}
            className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
            onClick={() => setShowDropdown(false)} // Close dropdown on click
          >
            <User size={16} className="mr-2" />
            Profile
          </Link>
          <button
            className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
            onClick={() => {
              setShowDialog(true);
              setShowDropdown(false); // Close dropdown on click
            }}
          >
            <LogOut size={16} className="mr-2" />
            Sign out
          </button>
        </>
      ) : (
        <div className="space-y-2">
          {!isHomePage && (
            <Link
              to="/"
              className="block w-full px-4 py-2 text-center rounded-md bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 transition-all"
              onClick={() => setShowDropdown(false)} // Close dropdown on click
            >
              Get Started
            </Link>
          )}
          <Link
            to="/signin"
            className="block w-full px-4 py-2 text-center rounded-md border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
            onClick={() => setShowDropdown(false)} // Close dropdown on click
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  </div>
)}
      </div>
      <Delete
                        isOpen={showDialog}
                        onClose={() => setShowDialog(false)}
                        onConfirm={handleLogout}
                        title="Sign Out From Your Account?"
                        message="Are you sure you want to sign out from your account"
                        label='Sign Out'
                      />
    </nav>
  )
}