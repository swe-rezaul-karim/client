import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import {server_url} from "../../utils/connection.js";

const ProfileCard = () => {
  const [userData,setUserData] =useState([]);
  const {user} = useContext(AuthContext);
  useEffect(() => {
      fetch(`${server_url}/users`)
    .then((res) => res.json())
    .then((data) =>{
      console.log(data);
      const matchedUser = data.find((userData) => userData.email === user.email);
      console.log(matchedUser);
      if(matchedUser){
        setUserData(matchedUser);
      }
    })
    .catch((err) =>{
      console.error("Error fetching data:",err);
    });
  }
,[user])
  return (
    <div>
      <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <figure className="w-32 h-32 mb-2">
          <img className="rounded-full w-full h-full"
            src={userData.photo}
            alt="Shoes"
          />
        </figure>
          <div className="flex">
          <h2 className="card-title">{userData.name}</h2>
          <p className="font-bold text-primary">{userData.verified? "Verified":"Not Verified"}</p>
          </div>
          <p>{userData.email}</p>
          <div className="flex gap-2 mb-4">
            <div className="shadow-md rounded-md p-2">
                <p className="font-bold text-lg p-2">{userData.role === "admin"?userData.role: userData.role === "professional"?userData.category: "User Account"}</p>
                <p className="mt-2 bg-primary">{userData.role ==="professional"? "Professional Account": ""}</p>
            </div>
          </div>
          {/* <div className="card-actions w-full">
            <button className="btn bg-green-500 hover:bg-[#278f41] text-white py-2 px-6 rounde w-full">Message</button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
