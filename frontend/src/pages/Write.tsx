import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import 'quill/dist/quill.snow.css';
import { Thumbnail } from "../components/Thumbnail";
import getUserDetails from "../hooks/getUserDetails";
import { Send, X } from 'lucide-react';
import Loader from "../components/Loader";

interface CreatePostType {
  title: string;
  content: string;
}

export const Write = () => {
  const [inputs, setInputs] = useState<CreatePostType>({
    title: "",
    content: "",
  });
  const { loading } = getUserDetails();
  const { quill, quillRef } = useQuill();
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setInputs((c) => ({
          ...c,
          content: quill.root.innerHTML,
        }));
      });
    }
  }, [quill]);

  const handleClick = async () => {
    setIsHidden(!isHidden);
  };

  if (loading) {
    return (
      <Loader/>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="relative">
        {/* Thumbnail Modal */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
            !isHidden ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none -z-10'
          }`}
        >
          <div
            className={`transition-all duration-300 transform ${
              !isHidden ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <Thumbnail reset={!isHidden} inputs={inputs} />
            {true&& (
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                onClick={handleClick}
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Main Editor */}
        <div className={`transition-all duration-300 ${!isHidden ? 'blur-sm' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative mb-8">
              <div className="absolute left-0 top-1.5 sm:top-3 w-1 h-9 sm:h-12 bg-gradient-to-b from-cyan-400 to-teal-400 rounded-full"></div>
              <input
                type="text"
                placeholder="Enter your title..."
                className="w-full bg-transparent text-4xl md:text-5xl font-bold text-white pl-6 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg transition-all"
                onChange={(e) => {
                  setInputs((c) => ({
                    ...c,
                    title: e.target.value,
                  }));
                }}
              />
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
              <div className="h-[70vh] text-gray-200">
                <div ref={quillRef} className="h-full" />
              </div>
            </div>

            <div className="fixed bottom-8 right-8">
              <button
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 flex items-center shadow-lg"
                onClick={handleClick}
              >
                <Send className="w-5 h-5 mr-2" />
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};