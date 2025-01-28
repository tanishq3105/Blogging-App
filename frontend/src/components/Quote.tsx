import React from 'react'

export const Quote: React.FC = () => {
  return (
    <div className="h-screen bg-gray-800 flex justify-center items-center p-8">
      <div className="max-w-2xl">
        <blockquote className="text-4xl font-bold leading-tight text-gray-400 mb-6">
          "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world."
        </blockquote>
        <cite className="block text-right text-xl font-semibold text-[#1CD6CE]">
          - Albert Einstein, 1929
        </cite>
      </div>
    </div>
  )
}