import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {server_url} from "../../utils/connection.js";

const IdentityCheck = () => {
    const [users,setUsers ] = useState([]);


  useEffect(() => {
    fetch(`${server_url}/users`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        const matchedService = data.filter(
          (service) => service.role === "professional");
        if (matchedService) {
            setUsers(matchedService);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);
  const verifyUser = (userId) => {
    fetch(`${server_url}/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({verified:true}),
      })
      .then((res) => res.json())
      .then((data) => {
        setUsers((prevUsers) => 
        prevUsers.map((user) =>
        user.id === userId? {...user, verified:true}: user)
      );
        if (data.modifiedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Data is updated successfully",
            confirmButtonText: "Cool",
          });
        }
      });
    }

  return (
    <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Check Identity
          </h1>
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {users.map((user,index)=>(
        <div key={index} className="card w-full bg-base-100 shadow-xl">  
              <div className="card-body">
                <h2 className="card-title">{user.name}</h2>
                <p>Email:{user.email}</p>
                <p>Category: {user.category}/hr</p>
                <p>Phone:{user.phone}</p>
                {
                    user.identity && (
                        <p>
                            Identity File 
                            <a href={`${server_url}/${user.identity}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                            >
                                View File
                            </a>
                        </p>
                    )
                }
                <div className="card-actions justify-end">
                      <button className={user.verified?"btn btn-disabled":"btn btn-primary"} onClick={()=>verifyUser(user._id)}>{user.verified? "Verified": "verify"}</button> 
                </div>
              </div>
        </div>
        ))}
        </div>
      </div>
  )
}

export default IdentityCheck;