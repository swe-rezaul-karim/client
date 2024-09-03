import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider"
import {server_url} from "../../utils/connection.js";

const SubNav = () => {
  const [userData, setUserData] = useState([]);
  const {user} = useContext(AuthContext);

  useEffect(() => {
    if(user && user?.email){
      fetch(`${server_url}/users`)
    .then((res) => res.json())
    .then((data) =>{
      console.log(data);
      const matchedUser = data.find((userData) => userData.email === user.email);
      console.log(matchedUser);
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
  return (
    <div>
      <nav className="navbar bg-base-150">
        <div className="flex space-x-3">
        <NavLink to="/profile/aboutProfile" className="hover:bg-base-200 p-2 rounded-lg">
              About
            </NavLink>
            
            {
              userData.role === 'admin'?
<>
              <NavLink to="/profile/addService" className="hover:bg-base-200 p-2 rounded-lg">
          Add Service
           </NavLink>
              <NavLink to="/profile/identityCheck" className="hover:bg-base-200 p-2 rounded-lg">
          Identity Check
           </NavLink>
           </>
              :userData.role === 'user'?
              <NavLink to="/profile/myBooking" className="hover:bg-base-200 p-2 rounded-lg">
              My Booking
            </NavLink>
            :<NavLink to="/profile/myReviews" className="hover:bg-base-200 p-2 rounded-lg">
            My Reviews
          </NavLink>
            }
            
            {userData.role === "professional"?
            <>
            <NavLink to="/profile/myService" className="hover:bg-base-200 p-2 rounded-lg">
            My Service
            </NavLink>
            <NavLink to="/profile/bookedTask" className="hover:bg-base-200 p-2 rounded-lg">
          Booked Tasks
            </NavLink>
            <NavLink to="/profile/addTask" className="hover:bg-base-200 p-2 rounded-lg">
          Add Task
           </NavLink></> : ""
          }
            
        </div>
      </nav>
      <hr className="w-full"/>
    </div>
  );
};

export default SubNav;
