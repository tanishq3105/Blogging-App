interface AvatarProps {
  author: string;
  size?: string;
  textSize?:string;
}

export function Avatar({ author, size, textSize="text-sm" }: AvatarProps) {
  const getColorFromName = (name: string): string => {
    const colors = [
      "bg-blue-500",
      "bg-red-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-indigo-500",
      "bg-pink-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const first = author[0];
  const avatarColorClass = getColorFromName(author);

  return (
    <div>
      <div
        className={`${size} relative inline-flex items-center justify-center overflow-hidden rounded-full ${avatarColorClass}`}
        
      >
        <span className={`${textSize} text-white`}>{first}</span>
      </div>
    </div>
  );
}