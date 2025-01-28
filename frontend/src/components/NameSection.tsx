import { Avatar } from "./Avatar";

interface propTypes {
  name: string;
  email: string;
}
export const NameSection = ({name,email}:propTypes) => {
  return (
    <div className="pt-5 pb-10">
        <div className="flex flex-col gap-10">
        <div className="text-4xl text-white">
            Author Details 
        </div>
      <div className="flex gap-20">
        <div>
            <Avatar author={name} size="w-20 h-20" textSize="text-4xl"/>
        </div>
        <div className="flex flex-col justify-center">
            <span className="text-cyan-400 sm:text-3xl font-semibold">{name}</span>
            <span className="text-gray-500 sm:text-xl"> {email}</span>
        </div>
      </div>
        </div>
        
    </div>
  );
};
