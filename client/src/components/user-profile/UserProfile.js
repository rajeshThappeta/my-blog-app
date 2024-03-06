import "./UserProfile.css";
import { NavLink, Outlet } from "react-router-dom";

function UserProfile() {
  return (
    <>
     <NavLink to='articles' className='fs-4  nav-link mt-4' style={{color:'lightseagreen'}}>Articles</NavLink>
      <Outlet />
    </>
  );
}

export default UserProfile;
