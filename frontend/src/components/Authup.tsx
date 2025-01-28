import { SignupType } from "@basicdev04/common-app";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock } from 'lucide-react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const Authup = () => {
  const [postInputs, setPostInputs] = useState<SignupType>({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!postInputs.email || !postInputs.password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/v1/user/signup', {
        name: postInputs.name,
        email: postInputs.email,
        password: postInputs.password
      });
      if (response.status === 200) {
        const jwt = response.data.jwt;
        const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        const newExpiryTime = new Date().getTime() + oneWeekInMilliseconds;
        localStorage.setItem('token', jwt);
        localStorage.setItem('tokenExpiry', newExpiryTime.toString());
        if(localStorage.getItem('token')) {
          navigate('/blogs');
        }
      }
    } catch (e) {
      toast.error('Failed to Sign In');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 px-4">
      <div className="w-full max-w-md">
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl ">
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              Creat Your Account
            </h1>
            <p className="text-gray-400 mb-8">
              Already have an account?{" "}
              <a 
                href="/signin" 
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Sign Up
              </a>
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="nane"
                    placeholder="John Doe"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2.5 pl-10 pr-4 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    onChange={(e) => setPostInputs(c => ({
                      ...c,
                      name: e.target.value
                    }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="johndoe@example.com"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2.5 pl-10 pr-4 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    onChange={(e) => setPostInputs(c => ({
                      ...c,
                      email: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2.5 pl-10 pr-4 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    onChange={(e) => setPostInputs(c => ({
                      ...c,
                      password: e.target.value
                    }))}
                  />
                </div>
              </div>

              <button
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:from-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>
          </div>
        )}
        <ToastContainer
          position="bottom-right"
          theme="dark"
          toastClassName="bg-gray-800 text-white"
        />
      </div>
    </div>
  );
};