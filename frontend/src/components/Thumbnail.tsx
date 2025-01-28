import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { imgDb } from "../config/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from 'uuid';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ThumbnailProps {
  reset: boolean;
  inputs: {
    title: string;
    content: string;
  };
}

export const Thumbnail = ({ reset, inputs }: ThumbnailProps) => {
  const [file, setFile] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<string | null>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (reset) {
      setFile(undefined);
    }
  }, [reset]);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setLoading(true);

      const img = ref(imgDb, `Imgs/${v4()}`);
      uploadBytes(img, selectedFile).then(data => {
        getDownloadURL(data.ref).then(val => {
          setFile(URL.createObjectURL(selectedFile));
          setLoading(false);
          setImage(val);
        });
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setLoading(true);

      const img = ref(imgDb, `Imgs/${v4()}`);
      uploadBytes(img, selectedFile).then(data => {
        getDownloadURL(data.ref).then(val => {
          setFile(URL.createObjectURL(selectedFile));
          setLoading(false);
          setImage(val);
        });
      });
    }
  };

  const handleSubmit = async () => {
    try {
        setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/create`,
        {
          title: inputs.title,
          content: inputs.content,
          imageUrl: image,
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
      console.error("Error while creating blog post:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-2 bg-transparent">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 text-center mb-2">
            Upload Thumbnail
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Choose or drag a thumbnail image for your blog post
          </p>

          <div
            className={`relative group rounded-lg ${
              !file ? 'border-2 border-dashed border-gray-600 hover:border-cyan-500' : ''
            } transition-all duration-300`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="aspect-video overflow-hidden rounded-lg bg-gray-700">
              {file ? (
                <img
                  src={file}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                />
              ) : loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-full max-w-md h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 w-full animate-loading"></div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <ImageIcon size={48} className="mb-4" />
                  <p className="text-lg mb-2">Drop your image here</p>
                  <p className="text-sm text-gray-500">or</p>
                  <label className="mt-4 px-6 py-3 rounded-md bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 cursor-pointer transition-all duration-300 flex items-center">
                    <Upload size={18} className="mr-2" />
                    Choose File
                    <input type="file" className="hidden" onChange={handleChange} accept="image/*" />
                  </label>
                </div>
              )}
            </div>

            {file && (
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                <label className="px-6 py-3 rounded-md bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 cursor-pointer transition-all duration-300 flex items-center">
                  <Upload size={18} className="mr-2" />
                  Change Image
                  <input type="file" className="hidden" onChange={handleChange} accept="image/*" />
                </label>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 rounded-md bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 flex items-center font-medium"
              disabled={loading || !file}
            >
              {loading ? 'Uploading...' : 'Create Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};