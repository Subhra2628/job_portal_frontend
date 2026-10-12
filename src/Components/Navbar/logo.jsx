import { FiBriefcase } from "react-icons/fi";

const Logo = () => {
  return (
     <div className="flex items-center gap-2">
      <FiBriefcase className="text-2xl" />
      <span className="text-xl font-bold">HireNest</span>
    </div>
  );
};

export default Logo;