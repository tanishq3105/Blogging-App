import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Home } from './pages/Home';
import { Blogs } from './pages/Blogs';
import { Profile } from './pages/Profile';
import { AppBar } from './components/AppBar';
import { Write } from './pages/Write';
import { UpdateBlogs } from './pages/Update';
import { SingleBlog } from './pages/SingleBlog';
import { Signin } from './pages/SignIn';
import { Signup } from './pages/Signup';

function App() {
  // Custom hook to conditionally render AppBar
  const location = useLocation();
  const hideAppBarRoutes = ['/', '/signin', '/signup'];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Render AppBar only if the current path is not in `hideAppBarRoutes` */}
      {!hideAppBarRoutes.includes(location.pathname) && <AppBar />}
      
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/profile/:id?/:type" element={<Profile/>} />
          <Route path="/create" element={<Write />} />
          <Route path="/update/:id" element={<UpdateBlogs />} />
          <Route path="/blog/:id" element={<SingleBlog />} />
          {/* Fallback route */}
          <Route path="*" element={<div className="pt-24 text-center text-white">Page not found</div>} />
        </Routes>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="z-50"
      />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;