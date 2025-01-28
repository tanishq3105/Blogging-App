import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Save, Trash2 } from 'lucide-react';
import axios from "axios";
import { useState, useEffect } from "react";
import { useQuill } from "react-quilljs";
import { getSingleBlog } from "../hooks/getSingleBlog";
import { Delete } from "../components/Delete";

interface CreatePostType {
  title: string;
  content: string;
}

export const UpdateBlogs = () => {
  const { id } = useParams();
  const { loading, blog } = getSingleBlog(id);
  const [inputs, setInputs] = useState<CreatePostType>({
    title: "",
    content: "",
  });
  const { quill, quillRef } = useQuill();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving]=useState(false);
  useEffect(() => {
    if (blog) {
      setInputs({
        title: blog.title,
        content: blog.content,
      });
    }
  }, [blog]);

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setInputs((c) => ({
          ...c,
          content: quill.root.innerHTML,
        }));
      });
      quill.clipboard.dangerouslyPasteHTML(inputs.content);
    }
  }, [quill]);

  const handleClick = async () => {
    try {
        setIsSaving(true)
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/update`,
        {
          id,
          title: inputs.title,
          content: inputs.content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/blogs");
      } else {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error while updating blog post:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios({
        method: "delete",
        url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/delete`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          id: id,
        },
      });

      if (response.status === 200) {
        navigate(-1);
      } else {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error while deleting blog post:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="relative">
          <div className="absolute left-0 top-4 w-1 h-12 bg-gradient-to-b from-cyan-400 to-teal-400 rounded-full"></div>
          <input
            type="text"
            placeholder="Enter your title..."
            className="w-full bg-transparent text-4xl md:text-5xl font-bold text-white pl-6 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg transition-all"
            value={inputs.title}
            onChange={(e) => {
              setInputs((c) => ({
                ...c,
                title: e.target.value,
              }));
            }}
          />
        </div>

        <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
          <div className="text-gray-200">
            <div ref={quillRef} />
          </div>
        </div>

        <div className="fixed bottom-8 right-8 flex space-x-4">
          <button
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 flex items-center shadow-lg"
            onClick={handleClick}
          >
            <Save className="w-5 h-5 mr-2" />
            {(isSaving)?<div>Saving...</div>:<div>Save</div>}
          </button>
          <button
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center shadow-lg"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Delete
          </button>
        </div>

        <Delete
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title="Delete Blog Post"
          message="Are you sure you want to delete this blog post? This action cannot be undone."
          label="Delete"
        />
      </div>
    </div>
  );
};