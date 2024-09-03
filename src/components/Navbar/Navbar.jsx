import { useContext, useEffect, useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { AuthContext } from "../../providers/AuthProvider"
import Swal from "sweetalert2";
import {server_url} from "../../utils/connection.js";


const Navbar = () => {
  const [userData, setUserData] = useState([]);
  const {user, logOut} = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
    if(user && user?.email){
      fetch(`${server_url}/users`)
    .then((res) => res.json())
    .then((data) =>{
      // console.log(data);
      const matchedUser = data.find((userData) => userData.email === user.email);
      // console.log(matchedUser);
      if(matchedUser){
        setUserData(matchedUser);
      }
      // setUserData(data);
    })
    .catch((err) =>{
      console.error("Error fetching data:",err);
    });
  }
  else{
    setUserData([]);
  }
  },[user])


  const handleLogout = () => {
    logOut()
    .then(() => {
      Swal.fire({
        title: 'Logout',
        text: 'Successfully Logout',
        icon: 'Success',
        confirmButtonText: 'ok'
      });
      navigate("/")
  })
    .catch(err => {
      console.error("Logout failed", err);
    });
  };

  const navLinks = (
    <>
      <li className="text-lg">
      <NavLink to="/">Home</NavLink>
    </li>
    <li className="text-lg">
      <NavLink to="/service">Services</NavLink>
    </li>
    <li className="text-lg">
      <NavLink to="/provider">Providers</NavLink>
    </li>
    <li className="text-lg">
      <NavLink to="/forum">Forum</NavLink>
    </li>
    <li className="text-lg">
    <NavLink to="/messages" className= "relative">
          Messages
          {/* {newMessages.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
              {newMessages.length}
            </span>
          )} */}
        </NavLink>
    </li>
    </>

  )
  return (
    <div className="container mx-auto px-4 shadow-sm bg-base-100">
      
    <div className="navbar md:px-32">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        {navLinks}
      </ul>
    </div>
    <Link to="/" className="btn btn-ghost text-4xl font-extrabold text-primary">TaskMate</Link>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      {navLinks}
    </ul>
  </div>
  <div className="navbar-end">
    {user?.email?(
     <div className="dropdown dropdown-end">
     <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
       <div className="w-10 rounded-full">
         <img alt="user avatar" src={userData.photo } />
       </div>
     </div>
     <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
     <li><h2 className="text-lg font-semibold">{userData.name}</h2></li>
       <li><Link to="/profile">Profile</Link></li>
       <li><Link to="/setting">Settings</Link></li>
       <li><Link onClick={handleLogout}>Logout</Link></li>
     </ul>
   </div>)
    :(
    <Link to="/login" className="text-lg btn text-tomato">
      Login
      </Link>)
    }
  </div>
</div>
</div>
  )
}

export default Navbar