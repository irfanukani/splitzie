import { NavLink } from "react-router-dom";

const Tab = (props) => {
  return <NavLink to={props.name} 
  className={` ${props.isActive ? "border-r-4 rounded-sm font-bold"  :  " "} px-2 items-center py-2 my-2 border-orange-600 w-full cursor-pointer text-white flex transition transition-all duration-110`}>
    {props.icon} &nbsp;&nbsp;
    {props.name}
  </NavLink>;

};
export default Tab;